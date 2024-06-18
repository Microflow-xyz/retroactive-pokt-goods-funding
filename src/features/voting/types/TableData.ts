export interface TableDataType {
  projectName: string;
  lowImpact: number;
  mediumImpact: number;
  highImpact: number;
  highestImpact: number;
  totalRewards?: string;
  totalPoints?: number;
  id: string;
}

export type Project = {
  attester: string;
  id: string;
  metadataPtr: string;
  metadataType: { type: string; hex: string };
  name: string;
  recipient: string;
  refUID: string;
  revoked: boolean;
  round: string;
  schemaId: string;
  time: number;
  type: string;
};

export type ImpactData = {
  lowImpactProjects?: Project[];
  mediumImpactProjects?: Project[];
  highImpactProjects?: Project[];
  highestImpactProjects?: Project[];
};
