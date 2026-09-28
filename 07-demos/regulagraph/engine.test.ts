// 07-demos/regulagraph.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  RegulaGraphNode,
  RegulaGraphEdge,
  RegulaGraphData,
  DocumentIngestionResult,
  PolicyQueryResponse,
  RegulaGraphAPI
} from '../src/types/RegulaGraph';

// Mock implementation of the RegulaGraphAPI
const mockRegulaGraphAPI: RegulaGraphAPI = {
  async ingestDocument(file: File, metadata: Record<string, any>): Promise<DocumentIngestionResult> {
    if (file.name === 'policy_doc_A.pdf') {
      return {
        documentId: 'doc-123',
        status: 'SUCCESS',
        extractedNodes: [
          { id: 'node-1', label: 'Policy', name: 'Bildungsreform 2024', type: 'EducationPolicy' },
          { id: 'node-2', label: 'Department', name: 'Senatsverwaltung Bildung', type: 'GovDepartment' }
        ],
        extractedEdges: [
          { id: 'edge-1', source: 'node-1', target: 'node-2', type: 'IMPACTS' }
        ]
      };
    }
    if (file.name === 'invalid_doc.txt') {
      return {
        documentId: 'doc-fail',
        status: 'FAILED',
        extractedNodes: [],
        extractedEdges: [],
        errorMessage: 'Unsupported file type or parsing error'
      };
    }
    return { documentId: 'doc-unknown', status: 'PENDING', extractedNodes: [], extractedEdges: [] };
  },

  async queryGraph(naturalLanguageQuery: string): Promise<PolicyQueryResponse> {
    if (naturalLanguageQuery.includes('Bildungsreform')) {
      return {
        query: naturalLanguageQuery,
        graphData: {
          nodes: [
            { id: 'node-1', label: 'Policy', name: 'Bildungsreform 2024', type: 'EducationPolicy' },
            { id: 'node-2', label: 'Department', name: 'Senatsverwaltung Bildung', type: 'GovDepartment' },
            { id: 'node-3', label: 'Person', name: 'Senatorin Muster', type: 'Politician' }
          ],
          edges: [
            { id: 'edge-1', source: 'node-1', target: 'node-2', type: 'IMPACTS' },
            { id: 'edge-2', source: 'node-3', target: 'node-1', type: 'CREATED_BY' }
          ]
        },
        relevantDocuments: [
          { id: 'doc-123', title: 'Bildungsreform 2024 (Gesetzestext)', snippet: '...' }
        ]
      };
    }
    return { query: naturalLanguageQuery, graphData: { nodes: [], edges: [] }, relevantDocuments: [] };
  },

  async getNodeDetails(nodeId: string): Promise<RegulaGraphNode & { connectedEdges: RegulaGraphEdge[] }> {
    if (nodeId === 'node-1') {
      return {
        id: 'node-1',
        label: 'Policy',
        name: 'Bildungsreform 2024',
        type: 'EducationPolicy',
        properties: { status: 'active', effectiveDate: '2024-01-01' },
        connectedEdges: [
          { id: 'edge-1', source: 'node-1', target: 'node-2', type: 'IMPACTS' },
          { id: 'edge-2', source: 'node-3', target: 'node-1', type: 'CREATED_BY' }
        ]
      };
    }
    throw new Error('Node not found');
  }
};

describe('RegulaGraph API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear any spies or mocks before each test
  });

  it('should successfully ingest a valid policy document and return extracted graph data', async () => {
    const mockFile = new File(['dummy content'], 'policy_doc_A.pdf', { type: 'application/pdf' });
    const result = await mockRegulaGraphAPI.ingestDocument(mockFile, { department: 'Education' });

    expect(result.status).toBe('SUCCESS');
    expect(result.documentId).toBe('doc-123');
    expect(result.extractedNodes).toHaveLength(2);
    expect(result.extractedEdges).toHaveLength(1);
    expect(result.extractedNodes[0]).toEqual(expect.objectContaining({ name: 'Bildungsreform 2024', label: 'Policy' }));
  });

  it('should return FAILED status for an invalid document', async () => {
    const mockFile = new File(['dummy content'], 'invalid_doc.txt', { type: 'text/plain' });
    const result = await mockRegulaGraphAPI.ingestDocument(mockFile, {});

    expect(result.status).toBe('FAILED');
    expect(result.errorMessage).toBe('Unsupported file type or parsing error');
    expect(result.extractedNodes).toHaveLength(0);
    expect(result.extractedEdges).toHaveLength(0);
  });

  it('should query the graph with natural language and return relevant data', async () => {
    const query = 'Who created the Bildungsreform 2024 and which department does it impact?';
    const response = await mockRegulaGraphAPI.queryGraph(query);

    expect(response.query).toBe(query);
    expect(response.graphData.nodes).toHaveLength(3);
    expect(response.graphData.edges).toHaveLength(2);
    expect(response.relevantDocuments).toHaveLength(1);
    expect(response.graphData.nodes.some(node => node.name === 'Senatorin Muster')).toBe(true);
    expect(response.graphData.edges.some(edge => edge.type === 'CREATED_BY')).toBe(true);
  });

  it('should return node details including connected edges', async () => {
    const nodeId = 'node-1';
    const details = await mockRegulaGraphAPI.getNodeDetails(nodeId);

    expect(details.id).toBe(nodeId);
    expect(details.name).toBe('Bildungsreform 2024');
    expect(details.connectedEdges).toHaveLength(2);
    expect(details.connectedEdges.some(edge => edge.target === 'node-2' && edge.type === 'IMPACTS')).toBe(true);
  });

  it('should return empty results for an unknown query', async () => {
    const query = 'What about the new park regulations in Mitte?';
    const response = await mockRegulaGraphAPI.queryGraph(query);

    expect(response.graphData.nodes).toHaveLength(0);
    expect(response.graphData.edges).toHaveLength(0);
    expect(response.relevantDocuments).toHaveLength(0);
  });
});