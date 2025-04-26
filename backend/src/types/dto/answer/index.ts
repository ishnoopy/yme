
export interface CreateAnswerRepositoryDto {
  message_id: string;
  user_id: string;
  content: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface CreateAnswerServiceDto {
  message_id: string;
  user_id: string;
  content: string;
}

