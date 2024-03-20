export interface HealthInsuranceInfo {
  medical: boolean;
  dental: boolean;
  vision: boolean;
}

export interface OtherOptionsInfo {
  unlimitedPTO: boolean;
  has401k: boolean;
  healthInsurance: HealthInsuranceInfo;
  flexibleWorkHours: boolean;
  remoteWorkOptions: boolean;
  relocationAssistance: boolean;
  maternityPaternityLeave: boolean;
  gymMembership: boolean;
  tuitionAssistance: boolean;
}

export interface JobOfferInfo {
  baseSalary: string;
  equity: string;
  signOnBonus: string;
  otherOptions: OtherOptionsInfo;
}

export interface ExtraInfo {
  jobOfferInfo: JobOfferInfo;
}

export interface CreatePostData {
  user_id: string;
  post_text: string;
  token?: string;
  extra: ExtraInfo;
  id?: string;
}

export interface Post {
    id: string;
    user_id: string;
    project_id: string;
    post_date: string;
    post_text: string;
    extra: ExtraInfo;
}

export interface PreprocessedPost {
    id: string;
    user_id: string;
    project_id: string;
    post_date: string;
    post_text: string;
    extra: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment_date: string;
  comment_text: string;
}