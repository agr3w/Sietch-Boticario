import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { globalSx } from "../theme/styles";
import mascote from "../assets/mascote.png";

function Login() {
  const navigate = useNavigate();
  const { currentUser, loginComGoogle, loginComEmail, cadastrarComEmail } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    const emailLimpo = email.trim();
    if (!emailLimpo || !senha) {
      setErro("Informe e-mail e senha para prosseguir.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      if (isLogin) {
        await loginComEmail(emailLimpo, senha);
      } else {
        await cadastrarComEmail(emailLimpo, senha);
      }
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const codigoErro = String(error?.code ?? "");

      if (codigoErro.includes("auth/invalid-credential") || codigoErro.includes("auth/wrong-password")) {
        setErro("Credenciais inválidas. Verifique e tente novamente.");
      } else if (codigoErro.includes("auth/user-not-found")) {
        setErro("Usuário não encontrado para este e-mail.");
      } else if (codigoErro.includes("auth/email-already-in-use")) {
        setErro("Este e-mail já está em uso. Faça login ou use outro.");
      } else if (codigoErro.includes("auth/weak-password")) {
        setErro("Senha fraca. Use ao menos 6 caracteres.");
      } else {
        setErro("Falha na autenticação. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogle = async () => {
    setErro("");
    setCarregando(true);

    try {
      await loginComGoogle();
      navigate("/dashboard", { replace: true });
    } catch {
      setErro("Falha na autenticação genética via Google.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={[
        globalSx.pageTexture,
        {
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          backgroundColor: "background.default",
        },
      ]}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 0,
          border: "1px solid rgba(61, 40, 16, 0.1)",
          backgroundColor: "background.paper",
          boxShadow: "0 10px 30px rgba(61, 40, 16, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Stack component="form" spacing={2} onSubmit={handleSubmitEmail}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
              <Box
                component="img"
                src={mascote}
                alt="Mascote Muad'Dib"
                sx={{ width: 80, height: 80, objectFit: "cover" }}
              />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: "text.primary",
                  fontFamily: '"Rajdhani", sans-serif',
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Sietch Boticário - Identificação
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.4,
                }}
              >
                {isLogin
                  ? "Acesse seu núcleo de cultivo"
                  : "Cadastre um novo operador do Sietch"}
              </Typography>
            </Box>

            {erro && <Alert severity="error">{erro}</Alert>}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              disabled={carregando}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6E553B",
                },
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                },
              }}
            />

            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              fullWidth
              disabled={carregando}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6E553B",
                },
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={carregando}
              sx={{
                borderRadius: 0,
                py: 1.2,
                fontWeight: 700,
                letterSpacing: "0.06em",
                backgroundColor: isLogin ? "primary.main" : "secondary.main",
                color: "#F5ECD7",
                "&:hover": {
                  backgroundColor: isLogin ? "primary.main" : "secondary.main",
                  filter: "brightness(0.95)",
                },
              }}
            >
              {carregando
                ? "Sincronizando acesso..."
                : isLogin
                  ? "Entrar"
                  : "Cadastrar"}
            </Button>

            <Button
              variant="text"
              disabled={carregando}
              onClick={() => {
                setErro("");
                setIsLogin((valor) => !valor);
              }}
              sx={{
                borderRadius: 0,
                color: "secondary.main",
              }}
            >
              {isLogin
                ? "Ainda não tem acesso? Cadastrar"
                : "Já possui acesso? Entrar"}
            </Button>

            <Divider
              sx={{
                color: "rgba(61, 40, 16, 0.7)",
                borderColor: "rgba(61, 40, 16, 0.18)",
                "&::before, &::after": {
                  borderColor: "rgba(61, 40, 16, 0.18)",
                },
              }}
            >
              ♦ ♦ ♦
            </Divider>

            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogle}
              disabled={carregando}
              sx={{
                borderRadius: 0,
                py: 1.15,
                borderColor: "rgba(13, 48, 40, 0.4)",
                color: "primary.main",
                letterSpacing: "0.04em",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(13, 48, 40, 0.06)",
                },
              }}
            >
              Autenticação Genética via Google
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
