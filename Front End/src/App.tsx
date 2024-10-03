import { FormEvent, useState } from "react";
import "./App.css";

function App() {
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [token, setToken] = useState<string>("");
  const [verToken, setVerToken] = useState("");
  const [dataVerToken, setDataVerToken] = useState<{ id?: number; username?: string; iat?: number; exp?: number; message?: string }>();
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...loginData,
          secretKey
        }),
      });
      const result = await token.json();
      console.log(result);

      setToken(result.message || result.token);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something wrong!");
      }
    }
  };

  const handleVerifyToken = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${verToken}`,
        },
        body: JSON.stringify({secretKey})
      });

      const result = await response.json();
      setDataVerToken(result.user || result);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something wrong!");
      }
    }
  };

  return (
    <main>
      <div className="w-full flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">
            Testing Authentikasi menggunakan JWT
          </h1>
        </div>

        <div>
          <input type="text" 
            placeholder="Secret Key"
            className="p-2 rounded-lg"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 p-4">
            <input
              type="text"
              placeholder="username"
              className="p-2 rounded-lg"
              value={loginData.username}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="password"
              className="p-2 rounded-lg"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
          <div>
            <button className="bg-slate-200 text-gray-800">Login</button>
          </div>
        </form>

        <div className={`${!token && "hidden"}`}>
          <h1 className="w-full text-center text-lg">Token</h1>
          <textarea
            className="w-[30rem] h-[10rem] p-2"
            name=""
            id=""
            value={token}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg" onClick={() => console.log(dataVerToken)}>Verifikasi Token</h1>
          <form
            action=""
            onSubmit={handleVerifyToken}
            className="flex flex-col gap-4"
          >
            <div className="w-full gap-4 grid grid-cols-2">
              <textarea
                className={`col-span-1 p-2 ${!dataVerToken && "col-span-2"}`}
                name=""
                id=""
                value={verToken}
                onChange={(e) => setVerToken(e.target.value)}
              />
              <div className={`${!dataVerToken && "hidden"} col-span-1`}>
                {dataVerToken?.message ? (
                  <p>{dataVerToken.message}</p>
                ) : (
                  <div>
                    <p>{`ID: ${dataVerToken?.id}`}</p>
                    <p>{`Username: ${dataVerToken?.username}`}</p>
                    <p>{`iat: ${dataVerToken?.iat}`}</p>
                    <p>{`exp: ${dataVerToken?.exp}`}</p>
                  </div>
                )
              }
              </div>
            </div>
            <div>
              <button className="bg-slate-200 text-gray-800">Verify</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default App;
