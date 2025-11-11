import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Landmark, BookingDetails, EmailDetails } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchLandmarks = async (destination: string): Promise<Landmark[]> => {
  try {
    const prompt = `List 5 famous historical landmarks in ${destination}. For each landmark, provide a name and a short, captivating description of about 50-70 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the historical landmark."
              },
              description: {
                type: Type.STRING,
                description: "A short, captivating description of the landmark."
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const landmarksData: Omit<Landmark, 'imageUrl'>[] = JSON.parse(jsonText);
    
    return landmarksData.map((landmark, index) => ({
      ...landmark,
      // Use a unique seed for each image to ensure variety
      imageUrl: `https://picsum.photos/seed/${destination.replace(/\s/g, '-')}-${index}/600/400`,
    }));

  } catch (error) {
    console.error("Error fetching landmarks:", error);
    throw new Error("Failed to fetch data from the Gemini API. Please check your API key and try again.");
  }
};

const findTravelOptionsDeclaration: FunctionDeclaration = {
  name: "findTravelOptions",
  description: "Finds flight and hotel options for a trip based on user criteria.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      travelers: {
        type: Type.NUMBER,
        description: "The number of people traveling."
      },
      budget: {
        type: Type.STRING,
        description: "The budget for the trip, e.g., 'economy', 'business', 'first class' for flights, or 'budget', 'luxury' for hotels."
      },
      hotelStars: {
        type: Type.NUMBER,
        description: "The desired star rating for the hotel (1-5)."
      },
      travelDates: {
        type: Type.STRING,
        description: "The desired travel dates, e.g., 'next week', 'the first week of July'."
      }
    },
    required: [] 
  }
};

const sendEmailDeclaration: FunctionDeclaration = {
    name: "sendEmail",
    description: "Sends an email to a recipient.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            recipient: {
                type: Type.STRING,
                description: "The email address of the recipient."
            },
            subject: {
                type: Type.STRING,
                description: "The subject line of the email."
            },
            body: {
                type: Type.STRING,
                description: "The body content of the email."
            }
        },
        required: ["recipient", "subject", "body"]
    }
};


export const planTrip = async (destination: string, prompt: string): Promise<BookingDetails> => {
  try {
    const fullPrompt = `Based on the following request for a trip to ${destination}, identify the travel options: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        tools: [{ functionDeclarations: [findTravelOptionsDeclaration] }],
      },
    });

    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      throw new Error("Could not determine travel options from your request. Please try being more specific.");
    }
    
    return functionCall.args;

  } catch (error) {
    console.error("Error planning trip:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to process your travel request with the Gemini API.");
  }
};

export const sendBookingConfirmationEmail = async (destination: string, bookingDetails: BookingDetails, recipientEmail: string): Promise<EmailDetails> => {
    try {
        const prompt = `
            Draft a concise booking confirmation email to '${recipientEmail}' for a trip to ${destination}.
            The booking details are: ${JSON.stringify(bookingDetails, null, 2)}.
            The email should be friendly and confirm the key details of the trip.
            Then, call the sendEmail function with the composed recipient, subject, and body.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [sendEmailDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (!functionCall || functionCall.name !== 'sendEmail') {
            throw new Error("Failed to generate the confirmation email.");
        }
        
        return functionCall.args as EmailDetails;

    } catch (error) {
        console.error("Error sending confirmation email:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to process the email request with the Gemini API.");
    }
};
