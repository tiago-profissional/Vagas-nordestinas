import { useState } from "react";

export default function CreateJob( onCancel  ){
    const [form, setForm] = useState({
        title: "",
        company: "",
        city: "",
        state: "",
        work_mode: "remote",
        employment_type: "full_time",
        salary_min: "",
        salary_max: "",
        description: "",
    });

    function setField(name, value){
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    return(
        <div className="container" style={{ paddingTop: 24}}>
            
            <form style={{ marginTop: 20, maxWidth: 700 }}>
                <div className="cj_grid">
                    <div className="cj-field">
                        <label htmlFor="cj-label">Titulo*</label>
                        <input
                            className="cj-input"
                            value={form.title}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ex: Frontend React"
                        />
                    </div>
                    <div className="cj-field">
                        <label htmlFor="cj-label">Empresa*</label>
                        <input
                            className="cj-input"
                            value={form.company}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ex: Minha empresa"
                        />
                    </div>

                    <div className="cj-field">
                        <label htmlFor="cj-label">Cidade*</label>
                        <input
                            className="cj-input"
                            value={form.city}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ex: Recife"
                        />
                    </div>
                    <div className="cj-field">
                        <label htmlFor="cj-label">Estado*</label>
                        <input
                            className="cj-input"
                            value={form.state}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ex: Ceará"/>
                    </div>

                    <div className="cj-field">
                        <label htmlFor="cj.label">Modalidade*</label>
                        <select
                        className="cj-input"
                        value={form.work_mode}
                        onChange={(e) => setField("work_mode", e.target.value)}>
                            <option value="remote">Remote</option>
                            <option value="onsite">Onsite</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="cj-field">
                        <label htmlFor="cj-label">Tipo de contrato*</label>
                        <select className="cj-input"
                        value={form.employment_type}
                        onChange={(e) => setField("employment_type", e.target.value)}>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="pj">PJ</option>
                        </select>
                    </div>

                    <div className="cj-field">
                        <label htmlFor="cj-label">Salário min. (R$)</label>
                        <input
                            className="cj-input"
                            value={form.salary_min}
                            onChange={(e) => setField("salary_min", e.target.value)}
                            placeholder="5000"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="cd-field">
                        <label htmlFor="cj-label">Salário max. (R$)</label>
                        <input
                            className="cj-input"
                            value={form.salary_max}
                            onChange={(e) => setField("salary_max", e.target.value)}
                            placeholder="5000"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="cj-field cj-field-full">
                        <label className="cj-label">Descrição</label>
                        <div 
                            className="cj-textarea"
                            value={form.description}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="Detalhes da vaga..."
                            rows={4}>

                        </div>
                    </div>

                </div>
            </form>

            <div className="cj-actions">
                <button type="button" className="cj-btn cj-btn-ghost" onClick={onCancel}>
                    Cancelar
                </button>

                <button type="submit" className="cj-btn cj-btn-primary">
                    Publicar Vaga
                </button>
            </div>


        </div>
    );
}