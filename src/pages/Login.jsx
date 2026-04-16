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
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -2,
            background:
              "radial-gradient(circle at 20% 10%, rgba(211,84,0,0.16) 0%, transparent 48%), radial-gradient(circle at 85% 80%, rgba(126,195,241,0.14) 0%, transparent 44%), linear-gradient(180deg, #1A2425 0%, #12191B 100%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            opacity: 0.08,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          },
        },
      ]}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 0,
          border: "1px solid rgba(211,154,44,0.72)",
          backgroundColor: "rgba(30, 58, 47, 0.7)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Stack component="form" spacing={2} onSubmit={handleSubmitEmail}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: "#E8E0D5",
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
                  color: "rgba(232,224,213,0.78)",
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
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(10,16,18,0.35)",
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
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(10,16,18,0.35)",
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
                background: "linear-gradient(135deg, #1B80C4 0%, #2F6F4E 100%)",
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
                color: "#E8E0D5",
              }}
            >
              {isLogin
                ? "Ainda não tem acesso? Cadastrar"
                : "Já possui acesso? Entrar"}
            </Button>

            <Divider
              sx={{
                color: "rgba(232,224,213,0.9)",
                borderColor: "rgba(211,154,44,0.32)",
                "&::before, &::after": {
                  borderColor: "rgba(211,154,44,0.32)",
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
                borderColor: "rgba(126,195,241,0.7)",
                color: "#DDEBF5",
                letterSpacing: "0.04em",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "rgba(126,195,241,0.95)",
                  backgroundColor: "rgba(27,128,196,0.12)",
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
