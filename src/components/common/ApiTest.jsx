import React, { useState } from "react";
import { authService } from "../../services/auth";
import { API_BASE_URL } from "../../constants";
import Button from "./Button";

const ApiTest = () => {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult("Probando conexión...");

    try {
      // Test with sample credentials
      await authService.login({
        usuario: "test",
        contrasenia: "test",
      });
      setTestResult("✅ Conexión exitosa");
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold text-white mb-4">Test de Conexión API</h3>

      <Button onClick={testConnection} loading={loading} className="w-full mb-4">
        Probar Conexión
      </Button>

      {testResult && (
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white text-sm">{testResult}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-white/70">
        <p>URL actual: {API_BASE_URL}</p>
      </div>
    </div>
  );
};

export default ApiTest;
