import { ApiBase } from "./api.base";

interface GetSignedUrlRequest {
  fileType: string;
  fileSize: number;
}

interface GetSignedUrlResponse {
  preSignedUrl: string;
  key: string;
}

export class S3Api extends ApiBase {
  constructor() {
    super("/s3");
  }

  async getSignedUrl(
    fileType: string,
    fileSize: number,
  ): Promise<GetSignedUrlResponse> {
    return this.fetchApi<GetSignedUrlRequest, GetSignedUrlResponse>(
      "post",
      `${this.endpoint}/get-signed-url`,
      {
        fileType,
        fileSize,
      },
    );
  }

  async uploadToS3(preSignedUrl: string, file: File): Promise<void> {
    await fetch(preSignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  }
}
