export interface KnowledgeBaseService {
    searchKnowledgeBase(query: string): Promise<any[]>;
    addEmbeddingToDocument(document: any): Promise<void>;
    updateAllDocumentsWithEmbeddings(): Promise<void>;
  }