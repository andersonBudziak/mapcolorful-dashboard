
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Tentativa de acesso a rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-merx-background">
      <div className="text-center p-8 bg-white rounded-lg shadow-merx">
        <img 
          src="/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png" 
          alt="MERX Logo" 
          className="h-12 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-merx-primary">404</h1>
        <p className="text-xl text-merx-secondary mb-6">Página não encontrada</p>
        <p className="text-merx-text mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center"
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default NotFound;
