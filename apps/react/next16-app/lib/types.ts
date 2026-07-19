export type Item = {
  id: string;
  title: string;
  body: string;
  /** 相对路径，如 /uploads/xxx.png */
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
