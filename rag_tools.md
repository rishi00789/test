Designing an Open-Source RAG Chat Assistant (VS Code Extension)
Retrieval-Augmented Generation (RAG) Overview
Retrieval-Augmented Generation (RAG) combines a large language model (LLM) with an external knowledge base. In RAG, user queries are answered by first retrieving relevant documents and then feeding them as context to the LLM[1]. This ensures answers stay accurate and up-to-date. For example, AWS explains that RAG “redirects the LLM to retrieve relevant information from authoritative” sources before answering[1]. A typical RAG system has two phases[2]: an indexing phase to build a vector database of your documents, and a query phase to retrieve relevant chunks and generate answers.
Indexing Pipeline
Indexing (offline) – In the first phase we ingest and preprocess the data. We load source documents (e.g. PDFs, code files, text, etc.), split large texts into smaller chunks, and compute vector embeddings for each chunk. These embeddings are stored in a vector database for fast similarity search[3]. The diagram above (from LangChain docs) shows this LOAD → SPLIT → EMBED → STORE workflow[3]. After indexing, we have a searchable knowledge base of embedded vectors.
  •  Load data from sources (files, databases, code repos, etc.).
  •  Split text/code into chunks (for efficient indexing).
  •  Use an open-source embedding model (e.g. Sentence-Transformers such as all-MiniLM-L6-v2) to convert each chunk into a vector.
  •  Store these vectors in an open-source vector database (see below) for semantic search.
Retrieval & Answer Generation
Retrieval (runtime) – When a user asks a question, the query is converted to a vector and matched against the vector store. The top-k relevant document chunks are retrieved (e.g. all sections about “annual leave” for a leave policy query[4]). These retrieved texts are added to the LLM’s prompt as context. Then the LLM generates an answer based on both the query and the retrieved context[5][6]. By grounding the model with actual data, RAG greatly reduces hallucinations and ensures answers can be traced back to sources.
  •  Convert the user’s query into an embedding and search the vector DB for nearest neighbors.
  •  Retrieve the most relevant document chunks.
  •  Augment the LLM prompt by appending these chunks (source attribution can be included).
  •  The LLM (GPT-OSS) generates the final answer using this enriched prompt[5][6].
Key Components & Open-Source Tools
  •  Embedding Model: Use an open-source sentence embedding model (e.g. SBERT/all-MiniLM-L6-v2) to encode text chunks into vectors.
  •  Vector Database: Choose an open-source vector search engine. For example, Qdrant is a high-performance vector DB written in Rust[7], Weaviate is a developer-friendly open-source vector DB[8], and Milvus is a scalable open-source GenAI vector database[9]. These let you store and query billions of vectors on your own hardware.
  •  LLM (GPT-OSS): Use OpenAI’s new GPT-OSS models (Apache 2.0 licensed) as the core LLM. The 120B model runs on a single 80 GB GPU, while the smaller 20B model runs on a 16 GB GPU[10]. These open-weight models offer strong reasoning and chain-of-thought capabilities at no licensing cost[10]. (All weights are on Hugging Face with quantization to reduce memory[11].)
  •  RAG Framework: Use an open-source pipeline library to glue everything together. Popular choices include LangChain or Haystack. Haystack, for example, is a production-ready open-source framework built for RAG and other LLM tasks[12]. These frameworks provide components for document loading, text splitting, embedding, vector search, and chaining to an LLM, so you don’t have to implement the glue code from scratch.
  •  Open Licenses: All recommended tools are permissively licensed. GPT-OSS is Apache 2.0[13], VS Code is MIT[14], and frameworks like LangChain/Haystack are also MIT/Apache. This ensures no commercial fees.
Open-Source LLM (GPT-OSS)
Use GPT-OSS as the large language model. It’s OpenAI’s newly released open-weight LLM (120B and 20B sizes) with an Apache-2.0 license[13]. The 20B model can run on a desktop/server GPU with 16 GB of RAM, and the 120B model needs an 80 GB GPU[10]. The models are fine-tuned for reasoning and tool use, and they provide chain-of-thought outputs. Importantly, they can be run fully locally or on any infrastructure. In fact, Microsoft and others have partnered to run GPT-OSS on platforms like Azure, Hugging Face, AWS, etc[15]. For example, AWS SageMaker JumpStart lets you deploy the gpt-oss-20B model as an endpoint in the cloud[16]. Hugging Face, Ollama and Llama.cpp also support running these models efficiently[15]. This means you can prototype locally, then scale to cloud or mixed deployment without changing frameworks.
Vector Databases (Open Source)
Store your embeddings in an open-source vector search system. As noted above, Qdrant, Weaviate, and Milvus are popular choices for RAG. They all allow high-speed nearest-neighbor search on embeddings without licensing costs[7][8]. For example, Qdrant bills itself as “the leading open source vector database”[7], and Weaviate simplifies hybrid (vector + keyword) search[8]. You can run these as Docker containers or managed services. A simpler alternative is FAISS (an open-source library) combined with a lightweight server if you want maximum control and have engineering resources.
RAG Frameworks & Libraries
  •  LangChain: A popular open-source Python library for building LLM applications. It provides “chains” for indexing and retrieval that can connect your embedding model, vector store, and LLM. The LangChain tutorial illustrates a full RAG app flow[3][5].
  •  Haystack: A Python framework by deepset for real-world RAG systems. It offers modular pipelines and built-in support for many vector stores and LLMs, and is designed for production use[12]. Haystack even partners with top AI providers (OpenAI, Anthropic, etc.) but can run entirely on your own GPT-OSS model[12].
  •  LlamaIndex (GPT Index): Another open-source toolkit for connecting LLMs to external data. It can index docs and load them into prompts or query with a familiar API. These frameworks all use permissive licenses and have large communities, which makes building and iterating easier.
Front End: VS Code Extension
Build a custom VS Code extension to provide the user interface. VS Code is open-source (MIT) and supports extensions written in Node.js/TypeScript[14]. In fact, Microsoft just open-sourced its Copilot Chat extension under MIT[14], showing VS Code’s commitment to an open AI ecosystem. Your extension can implement a chat panel: users type questions, the extension sends them to your RAG backend (local or cloud), and displays the LLM’s response. It can also show source citations. VS Code extensions can easily call external services (via HTTPS) or even spawn a local Python/Node server. In summary, use the VS Code Extension API (JavaScript/TypeScript) to create a chatbot interface and connect it to your retrieval+LLM pipeline.
Deployment Options: Local vs Cloud
  •  Local (On-Premises): Run everything on your own hardware. You’ll need a capable GPU (e.g. ≥16 GB RAM for GPT-OSS-20B) plus CPU/RAM for embeddings and the database. Vector DBs like Qdrant or Weaviate can run on a desktop server (often via Docker). The benefit is zero ongoing fees and maximum data control. All software stays open-source. The main challenge is acquiring enough GPU memory if you want the 120B model[10]. For prototyping, GPT-OSS-20B on a 16 GB GPU is a good start.
  •  Cloud: Host components on cloud infrastructure. For example, you could spin up an AWS EC2 or GCP VM with GPU and install Qdrant and GPT-OSS there. AWS SageMaker JumpStart supports GPT-OSS-20B – you can deploy the model and query it via an endpoint[16]. Azure ML or Google Vertex AI could similarly host open models. Alternatively, use Hugging Face Spaces (Gradio) to serve a small demo (they offer free GPU hours for open models). Note that public clouds may introduce costs (compute, storage) even if the software is open-source. However, many providers grant free tiers or credits that can help initial testing. Importantly, OpenAI has collaborated with Hugging Face, AWS, Azure, etc., so the models run well on these platforms[15].
  •  Hybrid: You might use local resources for some parts (e.g. local vector DB) and cloud for others (e.g. LLM inference on a rented GPU). Or develop locally and only use cloud for scalability. Regardless of choice, all components remain open-source (you’re only paying for infrastructure).
Summary of Requirements
To implement the RAG assistant, you will need: an environment (Python/Node) to run the pipeline, the GPT-OSS model, an embedding model, and a vector DB – all open-source. Hardware-wise, a modern GPU machine (e.g. with ≥16 GB VRAM) covers the core tasks; more powerful GPUs enable the larger model. The VS Code extension (written in JavaScript/TypeScript) provides the UI. By using open-source tools and permissive licenses (Apache/MIT), this solution incurs no proprietary fees[13][14]. In development, you can prototype with smaller models or free cloud credits, then scale up. Key libraries/frameworks to explore include LangChain or Haystack (Python) and the VS Code extension API. With these building blocks in place, your team can start coding the RAG assistant: index your documents, connect to GPT-OSS, and interact via VS Code.
Sources: We based this plan on RAG and vector search fundamentals[1][3], OpenAI’s GPT-OSS announcement[13][11], and documentation of open vector DBs[7][8] and frameworks[12]. The VS Code extension approach follows Microsoft’s open-source AI strategy[14]. Each suggestion here is supported by these references.

[1] [4] [6] What is RAG? - Retrieval-Augmented Generation AI Explained - AWS
https://aws.amazon.com/what-is/retrieval-augmented-generation/
[2] [3] [5] Build a Retrieval Augmented Generation (RAG) App: Part 1 | ️ LangChain
https://python.langchain.com/docs/tutorials/rag/
[7] Qdrant - Vector Database - Qdrant
https://qdrant.tech/
[8] Open Source Vector Database | Weaviate
https://weaviate.io/platform
[9] Milvus | High-Performance Vector Database Built for Scale
https://milvus.io/
[10] [11] [13] [15] Introducing gpt-oss | OpenAI
https://openai.com/index/introducing-gpt-oss/
[12]  Haystack | Haystack 
https://haystack.deepset.ai/
[14] VS Code: Open Source AI Editor
https://code.visualstudio.com/blogs/2025/05/19/openSourceAIEditor
[16] OpenAI open weight models now available on AWS | AWS News Blog
https://aws.amazon.com/blogs/aws/openai-open-weight-models-now-available-on-aws/

