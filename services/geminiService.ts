
import { GoogleGenAI, Type } from "@google/genai";
import { User, Skill } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSkillRecommendations = async (user: User, allUsers: User[]): Promise<string[]> => {
  if (!process.env.API_KEY) return [];

  const prompt = `
    Based on this student's profile:
    - Interested in learning: ${user.profile.learningSkills.join(', ')}
    - Bio: ${user.profile.bio}
    - Department: ${user.profile.department}

    Available teachers in the platform teach these categories: ${Array.from(new Set(allUsers.flatMap(u => u.profile.teachingSkills.map(s => s.category)))).join(', ')}

    Suggest 3-5 specific sub-skills or related skills this student might be interested in.
    Return only a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return [];
  }
};

export const getSmartMatches = async (query: string, availableSkills: { teacherName: string, skill: Skill }[]): Promise<string[]> => {
  if (!process.env.API_KEY) return [];

  const skillsData = availableSkills.map(s => `${s.skill.name} (Level: ${s.skill.level}, Teacher: ${s.teacherName})`).join(', ');

  const prompt = `
    A student is searching for: "${query}".
    Here are the available teaching offers on our campus platform: ${skillsData}.
    
    Match the most relevant ones. Rank them by relevance.
    Return only the teacher names that are the best matches as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Matching Error:", error);
    return [];
  }
};
