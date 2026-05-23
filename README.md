# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



## Para instalar un proyecto en React con StockFlow (carpeta stockflow)
npm create vite@latest stockflow -- --template react # crea carpeta proyecto

npm install # instala librería npm

npm run dev  # levanta proyecto en http://localhost:5173/

# En vercel https://mine-cost-react.vercel.app/ (muestra)


# Acciones a realizar después de clonar repo:
1. Instalar librerías npm install (se hace en la TERMINAL) node.js (eso está listo)
2. Hacer funcionar App.jsx con "npm run dev", Local:   http://localhost:5173/ (frontend) *
3. Trabajar las fórmulas
4. Supabase como base de datos
5. Prender el servidor con: "node server.js" (backend) *
La carga masiva debe subir de esta forma (.csv):
```
Dia;Hrs_Op;TMH_Trat;Humedad_Porc;Ley_Cabeza;Espiral_Ley;Espiral_TMS;Icon_Ley;Icon_TMS;Flotacion_Ley;Flotacion_TMS;Ley_Relave
1;Mañana;7.84;2.33;3.37;;0;842.34;0.01;67.09;0.22;0.38
1;Tarde;30.94;2.58;5.68;;0;7028.8;0.015;427.6;0.11;0.55
2;Mañana;31.82;5.71;5.89;;0;1901.5;0.023;175.13;0.6;0.93
2;Tarde;29.88;4.31;4.86;;0;1371.99;0.027;168.48;0.5;0.62
3;Mañana;31.28;5.78;5.47;;0;1089.83;0.035;116.09;0.9;0.63
3;Tarde;30.37;4.31;4.72;42.74;0.25;792.52;0.035;77.99;1.12;0.38;...

* En lo que respecta a TMH o TMS debe haber 0 en caso de no medir nada.
* En cálculos de ley, no debe haber nada, 0s tampoco (para que pueda hacer el cálculo).
```