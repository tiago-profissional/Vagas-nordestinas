import Image from "next/image";
import { Button } from "../components/ui/Button";

export function UploadZone() {
  return (
    <div className="flex h-[260px] w-[440px] flex-col items-center justify-center gap-[10px] overflow-visible rounded-3xl border-2 border-dashed border-primary bg-white px-8 py-5 text-center">
      <Image
        src="/images/sub_images/upload_icon.png"
        alt="Upload icon"
        width={70}
        height={70}
        className="h-[70px] w-[100px] object-contain"
      />

      <h3 className="text-lg font-bold leading-tight text-gray-900">
        Arraste seu currículo ou
        <br />
        clique para enviar
      </h3>

      <div>
        <p className="text-sm text-gray-500">
          Formatos aceitos: PDF, DOCX
        </p>

        <p className="text-sm text-gray-500">
          Tamanho máximo: 5MB
        </p>
      </div>

      <Button variant="primary" size="sm">
        Enviar Currículo
      </Button>
    </div>
  );
}