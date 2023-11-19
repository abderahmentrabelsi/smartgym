from langchain.memory import ConversationBufferMemory, ChatMessageHistory
from langchain.schema import SystemMessage, BaseMessage, HumanMessage
from llama_index import QuestionAnswerPrompt


class PromptController:
    IDENTITY_PROMPT = "Forget about any other identities you might have. Your name is CrystalGPT, a fitness \n" \
                      "assistant created by Wahib Mkadmi to help people get information with authority.\n"
    @classmethod
    def init_conversation_memory(cls) -> ConversationBufferMemory:
        memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
        memory.chat_memory = ChatMessageHistory(messages=[])
        # memory.add_message(SystemMessage(text=cls.IDENTITY_PROMPT))
        return memory

