export type HerbSampleStatus = 'Pending Review' | 'Approved' | 'Rejected' | 'Batched' | 'Appealed';

export type AIResult = {
  species: string;
  confidence: number;
  qualityScore: number;
};

export type QCReview = {
  status: 'Approved' | 'Rejected';
  agentId: string;
  agentName: string;
  timestamp: string;
  reason?: string;
};

export type Appeal = {
    reason: string;
    timestamp: string;
}

export type HerbSample = {
  id: string;
  collectorId: string;
  collectorName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  imageHint: string;
  notes?: string;
  quantity?: number;
  status: HerbSampleStatus;
  aiResult?: AIResult;
  qcReview?: QCReview;
  appeal?: Appeal;
};

export type Batch = {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  createdAt: string;
  sampleIds: string[];
  batchHash: string;
  qrCodeUrl: string;
  blockchainAnchor?: {
    txId: string;
    chain: string;
    timestamp: string;
  };
};

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Message = {
    id: number;
    text: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    avatarSeed: string;
    timestamp: string;
};
  
export type UserRole = 'consumer' | 'farmer' | 'admin' | 'qc' | 'manufacturer';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
    status: 'active' | 'suspended';
    createdAt: string;
    password?: string;
};