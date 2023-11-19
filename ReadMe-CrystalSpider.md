# CrystalSpider: A Contextual Search Engine for Scientific Articles 🕷️

## ➡️ Show me the goods 

Head here: [CrystalSpider Home](https://smartgym.mkadmi.tech/pages/knowledge-base)  
Armed with those credentials: 
 - Username: `demo20@gogo.com`
 - Password: `testtest0`

But I strongly invite you to read along first. 

# I - Introduction

## The Need 

The primary goal of CrystalSpider is to create a _contextual search engine_ that understands natural language, specifically designed for medical articles. It is capable of crawling, indexing, and classifying documents from both PubMed, internal health authorities' SharePoint directories, and can be extended to any other data source. 

Traditional search engines match scientific papers or articles through keywords. This method relies on the assumption that the keywords efficiently represent the paper's informative content. However, when dealing with scientific papers, this isn't sufficient. CrystalSpider aims to develop a scoring method for abstracts and texts based on the assessment of similarity between them and the proposed query.

# II - Component Breakdown 🚀

## 1) CrystalTorch 🔥

CrystalTorch is a self-hosted node running on [TorchServe](https://pytorch.org/serve/) that manages the ML models. TorchServe is an open-source model serving library that makes it easy to deploy and manage PyTorch models at scale.

The system runs two models:

- **paraphrase-distilroberta-base-v1**: A bi-encoder that serves as a sentence transformer.  
**Bi-encoders** transform both the query and the documents into a shared embedding space. This enables efficient similarity search by comparing the query's embedding to the embeddings of all documents in the collection.
- **cross-encoder/ms-marco-MiniLM-L-6-v2**: A cross-encoder that scores text against a query.  
**Cross-encoders** score a query and a document jointly. Instead of mapping them into a shared embedding space, cross-encoders consume the query and document together and output a single relevance score.

📜 CrystalTorch uses a _retrieve and rerank strategy_, where the bi-encoder retrieves relevant documents and the cross-encoder scores and refines the results. Retrieve and rerank strategies are used to overcome the trade-off between speed and accuracy in information retrieval tasks.

### 🌐 CrystalTorch Exposes 3 API methods

1. **Get Paragraph Embeddings**: This method generates embeddings for paragraphs using the `paraphrase-distilroberta-base-v1` bi-encoder model. These embeddings represent the semantic meaning of the text in a dense vector format, suitable for similarity comparisons.
2. **Score Paragraphs against a Query**: This method takes a query and a list of paragraphs as input and calculates the relevance score of each paragraph to the query using the `cross-encoder/ms-marco-MiniLM-L-6-v2` cross-encoder model.
3. **Rank Paragraphs against a Query**: This method takes a query and a list of paragraphs as input and ranks the paragraphs based on their relevance to the query. It combines the results of the Get Paragraph Embeddings method and the Score Paragraphs against a Query method, providing a sorted list of paragraphs with their respective relevance scores.

## 2) CrystalSpider Core 🕸️

CrystalSpider Core is the backbone of the application, responsible for indexing and querying documents in the database and outside. It works in conjunction with CrystalTorch to generate embeddings and score text against a query. The system is developed in [FastAPI](https://fastapi.tiangolo.com/), backed by [MongoDB](https://www.mongodb.com/) and uses [Redis](https://redis.io/) extensively.

CrystalSpider Core has two main functions:

### 2.1) Paper Search

1. **Query Initialization**: The user inserts the query.
2. **Query Correction**: After user inserts the query, spelling and grammatical mistakes are corrected with BioMed's API.
3. **Fetching Process**: A list of 20 papers from PubMed is extracted through the BioEntrez library and sent to CrystalTorch for analysis using the score_paragraphs method.
4. **Abstract Analysis**: Expert.ai analyzes the abstract of every fetched paper, extracting all relevant information: keywords and lemmas.
5. **Scoring Process**: By comparing the two previously generated dictionaries, a score is associated with each paper based on the relevance scores of shared elements between the abstract's text and the query.
6. **Mean Score**: A final score is generated, averaging the 'contextual' score and the fetching position score (rescaled between 0-100 with min-max method).
7. **Title Printing**: The papers are presented, ordered by the final mean score associated with the paper.
8. **Full Content Analysis**: In the background, the system fetches the full text of the papers with Grobid, a PDF to Text engine. CrystalTorch and ExpertAI analyze the score of each paragraph against the query, and ExpertAI identifies the main sentences.

### 2.2) Connected Articles

🚀 CrystalSpider features a similar article that's displayed besides every article the end-user is reading. This enhances the search experience by providing opening to search tangents and exploring related fields.

On each search, text embeddings for the title and abstract - referred to internally as `get_embedding_beacon` - are generated and inserted into the index. Text embeddings are dense vector representations of text, capturing semantic meaning in a continuous space. This allows for efficient comparisons between different pieces of text.

📦 [Faiss Index](https://github.com/facebookresearch/faiss) is a library for efficient similarity search and clustering of dense vectors. It contains algorithms that search in sets of vectors of any size, up to ones that possibly do not fit in RAM.

We configure the Faiss Index using an `IndexIDMap` over an `IndexFlatL2` index with 768 dimensions. `IndexIDMap` is a wrapper that allows associating an ID to each vector, providing a convenient way to map embeddings back to their original documents. `IndexFlatL2` is an index that uses Euclidean (L2) distance to compute similarities between vectors. While Faiss offers numerous features and configurations, we chose this setup to balance performance and accuracy in our search engine.

🔍 We perform an __[Approximate Nearest Neighbor (ANN)](https://towardsdatascience.com/comprehensive-guide-to-approximate-nearest-neighbors-algorithms-8b94f057d6b6)__ search with the given vector on user query. ANN search algorithms are used to find the closest vectors in high-dimensional spaces efficiently, trading off some accuracy for speed improvements.


## 3) CrystalGPT - Going ✨ beyond ✨ ChatGPT 💬  

### 🚨 Side note: CrystalGPT is ✨[not a ChatGPT integration](https://i.postimg.cc/150pnkhV/download.jpg)✨, nor is it an OpenAI provided service.  
CrystalGPT is a chatbot powered by cutting-edge technology. Its competitive advantage is that it responds factually and doesn't invent facts. It has 3 sub-components:

1. [GPT-3](https://openai.com/blog/openai-api): Large Language Model (LLM), provided by the OpenAI API. GPT-3 is a powerful language model that can generate coherent text. The key difference between GPT-3 and ChatGPT is that ChatGPT is specifically designed for conversation, whereas GPT-3 is a more general-purpose model.

2. [LlamaIndex](https://gpt-index.readthedocs.io/en/latest/index.html): A "bridge" between LLMs and external data. In this context, external data refers to our articles. Articles are parsed into "Nodes", and a tree index `GPTSimpleVectorIndex` is built over the set of candidate nodes, with a summary prompt seeded with the query. The tree is built in a bottoms-up fashion, and in the end, the root node is returned as the response. LlamaIndex offers composability of indices, allowing the construction of indices on top of other indices with the `ComposableGraph` class. This effectively indexes the entire document tree to feed custom knowledge to GPT.

3. [LangChain](https://python.langchain.com/en/latest/index.html): A framework for developing applications powered by language models. Question-answering involves fetching multiple documents and asking a question of them. The LLM response contains the answer to the question based on the content of the documents.

🚀 We've combined GPT-3, LlamaIndex, and LangChain to create a more powerful and flexible system 

🎉 This unique combination allows CrystalGPT to efficiently leverage external data, such as our medical articles, in a way that a raw integration with the OpenAI API cannot. By building indices over our document tree and integrating it with GPT-3, we can provide more accurate and contextually relevant responses, ultimately leading to a superior search experience.

# III - Physical Architecture

We have set up our environment using [Portainer](https://www.portainer.io/), a lightweight management tool for Docker environments. Portainer allows us to manage our containers efficiently and monitor their performance.

## 🐳 Containers 

Our system consists of the following containers, all connected on a single bridged network:

1. **Redis**: A high-performance in-memory data structure store used as a database, cache, and message broker.

2. **Meilisearch**: A powerful, fast, open-source, and easy-to-use indexer.

3. **CrystalTorch**: A TorchServe self-hosted node, running the ML models and exposing the API methods for processing and scoring text.

4. **CrystalSpider Core**: The backbone of our application, responsible for indexing and querying documents, working in conjunction with CrystalTorch.

5. **Frontend**: The user interface for our search engine, providing an accessible and intuitive way for users to interact with our system.

6. **Nginx Proxy Manager**: A traffic manager that handles incoming requests and routes them to the appropriate container, serving as the entry point for our system.

## 👽 External Services

We also rely on the following external services: 

1. **MongoDB** Hosted on Atlas, ensuring a high SLA.

2. 


## 🚀 Continuous Integration & Deployment (CI/CD) 

Our build process is automated using [GitHub Actions](https://github.com/features/actions). GitHub Actions enables us to create custom workflows for building, testing, and deploying our application.

Whenever a [workflow](https://github.com/TheRealMkadmi/pi-dev-twin/actions) is triggered, GitHub Actions automatically triggers the build process, and requests a re-pull from Portainer.

# IV - Conclusion
🥹 While CrystalSpider has some shortcomings, these are [conscious decisions made to reduce costs](https://www.youtube.com/watch?v=nFZP8zQ5kzk).  

For example, using an Approximate Nearest Neighbor search sacrifices some accuracy for faster results. As the system continues to develop and technology advances, these trade-offs can be reevaluated and adjusted to improve the overall search experience. We also cheat a little on CrystalGPT, letting the LLM answer instead of our articles in questions we *guess* aren't knowledge specific.

We also refrain from actively crawling the articles we find and lazy fetch on user demand. This degrades the UX, but it would be immeasurable cost for us to keep the spider always running 🪦.  

🫰 Please support the creator. It has already cost a lot. 