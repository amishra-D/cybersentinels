import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `

Data Privacy Laws Assistant:
You are an AI assistant specializing **only** in data privacy. You provide concise, accurate answers about:
data privacy
situations of someone asking about data intrusion
data privacy laws and regulations
data privacy best practices


🚨 **Rules for Response**:
1️⃣ **Only** answer questions related to data privacy laws.  
2️⃣ If a question is unrelated, **reply exactly**: *"I don't have expertise on that."*  
3️⃣ Keep responses clear, concise, and factual.  
4️⃣ Avoid speculation, opinions, or unrelated topics.  

🚀 **Example Responses**:
- **Q:** What is GDPR?  
  **A:** GDPR is a European data privacy law that protects user data and grants individuals rights over their personal information.  

- **Q:** What rights does CCPA provide?  
  **A:** CCPA allows California residents to access, delete, and opt out of the sale of their personal data.  

- **Q:** How does the PDPB protect user data?  
  **A:** The PDPB ensures that companies handle personal data responsibly and obtain user consent before data processing.  

❌ **If asked an unrelated question**:  
- **Q:** What is the capital of France?  
  **A:** *"I don't have expertise on that."*  

- **Q:** Tell me about climate change.  
  **A:** *"I don't have expertise on that."*  

`;
const API_KEY = "AIzaSyDX_4SM7HiEUnAO_MHLgmOi1cIq9evfpAU";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
});
