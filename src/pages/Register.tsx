import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight , Landmark } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const fields = [
    { label: "Nome completo", field: "name", type: "text", icon: User, placeholder: "João Silva" },
    { label: "Email", field: "email", type: "email", icon: Mail, placeholder: "seu@email.com" },
    { label: "Senha", field: "password", type: "password", icon: Lock, placeholder: "••••••••" },
    { label: "Confirmar senha", field: "confirmPassword", type: "password", icon: Lock, placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Landmark className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="logo-text  font-bold tracking-tight text-foreground">ALFA Bank</span>
          </div>
          <p className="text-muted-foreground text-xs tracking-widest uppercase">Crie sua conta</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-5">Criar conta</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map(({ label, field, type, icon: Icon, placeholder }) => (
              <div key={field}>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            ))}

            <button type="submit" className="btn-primary mt-2">
              Criar Conta
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
