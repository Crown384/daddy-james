export type CreateSubmissionInput = {
  name?: string;
  wish?: string;
  photoUrl?: string;
  photoPublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
};

export type BirthdaySubmission = CreateSubmissionInput & {
  _id: string;
  _creationTime: number;
  createdAt: number;
};
