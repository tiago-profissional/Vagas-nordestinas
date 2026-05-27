type ExtractedInfoProps = {
  data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    totalExperience: string;
  };
};

export function ExtractedInfo({ data }: ExtractedInfoProps) {
  return (
    <section className="w-[320px] rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      
      <div className="mb-5 flex items-center gap-3">
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-lg">
          👤
        </div>

        <h2 className="text-[18px] font-bold text-gray-900">
          Informações extraídas
        </h2>

      </div>

      <div className="space-y-4">
        <InfoRow label="Nome" value={data.name} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Telefone" value={data.phone} />
        <InfoRow label="Localização" value={data.location} />
        <InfoRow label="Experiência Total" value={data.totalExperience} />
      </div>

    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center">
      
      <span className="text-[14px] font-semibold text-gray-900">
        {label}
      </span>

      <span className="text-[14px] text-gray-600">
        {value}
      </span>

    </div>
  );
}