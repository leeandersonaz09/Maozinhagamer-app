export interface Attachment {
  slot: string;
  name: string;
}

export interface LoadoutItem {
  id: string;
  title: string;
  gunImageUrl?: string;
  thumbnailUrl?: string;
  weaponType: string;
  game?: string;
  tier: 'absolute_meta' | 'competitive' | 'optional';
  tierLabel: string;
  attachments: Attachment[];
  code?: string;
}

export interface LoadoutSection {
  title: string;
  data: LoadoutItem[];
}

export interface LoadoutsResponse {
  sections: LoadoutSection[];
  filters: {
    gunTypes: string[];
  };
}
