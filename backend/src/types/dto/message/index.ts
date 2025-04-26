export interface CreateMessageRepositoryDto {
  sender_id?: string;
  receiver_id: string;
  content: string;
  is_viewed?: boolean;
  is_answered?: boolean;
  is_deleted?: boolean;
  is_anonymous?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface CreateMessageServiceDto {
  sender_id?: string;
  receiver_id: string;
  content: string;
}

export interface UpdateMessageRepositoryDto {
  id: string;
  content?: string;
  is_viewed?: boolean;
  is_answered?: boolean;
}
