import Image from "next/image";

export function ResumeStatus() {
  return (
    <section className="flex h-[250px] w-[640px] flex-col items-center justify-center rounded-3xl border border-primary/40 bg-white text-center shadow-sm">
      <div className="mb-5 flex h-[58px] w-[158px] items-center justify-center rounded-2xl text-5xl text-primary">
        <Image
          src="/images/sub_images/resume_icon.png"
          alt="Upload icon"
          width={70}
          height={70}
          className="h-[70px] w-[150px] object-contain"
        />
      </div>

      <h2 className="text-xl font-bold text-white">
        Nenhum currículo enviado ainda
      </h2>

      <p className="mt-5 max-w-[520px] text-base text-gray-400">
        Envie seu currículo para receber análises personalizadas e recomendações.
      </p>
    </section>
  );
}