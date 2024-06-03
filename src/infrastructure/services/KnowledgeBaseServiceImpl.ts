import { KnowledgeBaseService } from './KnowledgeBaseService';
import { ChatGptService } from './ChatGptService';
// import { Schema, model } from 'mongoose';
import { MongoDatabase } from '../../data/mongoDB';


// const documentSchema = new Schema<IDocument>({
//   // _id: { type: mongoose.SchemaTypes.ObjectId, required: true, unique: true },
//   content: { type: String, required: true, unique: true },
//   plot_embedding: { type: [Number], required: true },
// });

// // Definiendo la interfaz Document utilizando MongooseDocument
// export interface IDocument{
//   content: string;
//   plot_embedding: number[];
// }
// const DocumentModel = model<IDocument>('knowledgebase', documentSchema);

export class KnowledgeBaseServiceImpl implements KnowledgeBaseService {
  private chatGptService: ChatGptService;

  constructor(chatGptService: ChatGptService,) {
    this.chatGptService = chatGptService;

  }

  async searchKnowledgeBase(query: string): Promise<any[]> {
    
    const embedding = await this.chatGptService.getEmbedding(query);

    
    if (!MongoDatabase.connection.readyState) {
      throw new Error("MongoDB connection not established. Please call MongoDatabase.connect() first.");
    }
    console.log("Conexión mongo: ");

    const db = MongoDatabase.connection.db;
    try {
      const collection = db.collection('knowledgebase'); // Replace with your collection name
      console.log("Using collection:", collection.collectionName);

      const documents = await collection
        .aggregate([
          {
            $vectorSearch: {
              queryVector: embedding,
              path: 'plot_embedding',
              numCandidates: 100,
              limit: 10,
              index: "knowledgebase_index",
            },
          },
        ])
        .toArray();

      return documents; // Return raw documents as the interface is not strictly necessary here
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      throw error; // Re-throw for proper error handling
    }
   
  }

  async addEmbeddingToDocument(document: any): Promise<void> {
    const embedding = await this.chatGptService.getEmbedding(document.content);

    const isEmptyArray = Array.isArray(embedding) && embedding.length === 0;

    const isNotString = typeof embedding !== 'string';
  
    console.log(`¿Es un array vacío? ${isEmptyArray}`);
    console.log(`¿No es un string? ${isNotString}`);
      if (!isEmptyArray && isNotString) {
        console.log('Successfully received embedding.');

        if (!MongoDatabase.connection.readyState) {
          throw new Error("MongoDB connection not established. Please call MongoDatabase.connect() first.");
        }
        console.log("Conexión mongo: ");
    
        const db = MongoDatabase.connection.db;

        const collection = db.collection('knowledgebase');
        const result = await collection.updateOne(
          { _id: document._id },
          { $set: { plot_embedding: embedding } }
        );

        if (result.modifiedCount === 1) {
          console.log('Successfully updated the document.');
        } else {
          console.log('Failed to update the document.');
        }
      } else {
        console.log(`Failed to receive embedding. Status code: ${embedding}`);
      }
    } catch (err: any) {
      console.error(err);
  }

  async updateAllDocumentsWithEmbeddings(): Promise<void> {
    if (!MongoDatabase.connection.readyState) {
      throw new Error("MongoDB connection not established. Please call MongoDatabase.connect() first.");
    }

    const db = MongoDatabase.connection.db;
    const collection = db.collection('knowledgebase');
    
    // const documentIdString = "663f1a21c7387144aea0f958";
    // const documentId =new  mongoose.Types.ObjectId(documentIdString);
    // console.log(typeof documentId);
    // console.log('Buscando documento con ID:', documentId);
    
    // try {
    //   const document = await DocumentModel.findOne(documentId);
    //   if (document) {
    //     console.log('Documento encontrado:', document);
    //     // await this.addEmbeddingToDocument(document);
    //     console.log('All documents have been processed.');
    //   } else {
    //     console.log('Documento no encontrado');
    //   }

      

    // } catch (error) {
    //   console.error("Error updating all documents with embeddings:", error);
    //   throw error;
    // }

    try {
      const documents = await collection.find().toArray();
      console.log(`Found ${documents.length} documents.`);

      for (const document of documents) {
        await this.addEmbeddingToDocument(document);
      }

      console.log('All documents have been processed.');
    } catch (error) {
      console.error("Error updating all documents with embeddings:", error);
      throw error;
    }
  }
  

}