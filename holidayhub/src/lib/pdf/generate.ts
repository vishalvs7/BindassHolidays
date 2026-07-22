import { renderToBuffer } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export async function generateBookingPDF(
  document: ReactElement
): Promise<Buffer> {
  return await renderToBuffer(document as any);
}
