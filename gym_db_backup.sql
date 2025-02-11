--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    producto_id integer,
    cantidad integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    membresia_id integer
);


--
-- Name: carrito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: carrito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_id_seq OWNED BY public.carrito.id;


--
-- Name: historial_compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_compras (
    id integer NOT NULL,
    user_id integer,
    producto_id integer,
    membresia_id integer,
    cantidad integer DEFAULT 1,
    total numeric(10,2) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



-- Name: historial_compras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historial_compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_compras_id_seq OWNED BY public.historial_compras.id;


--
-- Name: membresias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membresias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(10,2) NOT NULL,
    admin_id integer NOT NULL,
    imagen_url text
);

--
-- Name: membresias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membresias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: membresias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membresias_id_seq OWNED BY public.membresias.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    admin_id integer NOT NULL,
    imagen_url text NOT NULL
);


--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: rutinas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rutinas (
    id integer NOT NULL,
    dia character varying(50) NOT NULL,
    ejercicio character varying(100) NOT NULL,
    repeticiones character varying(50) NOT NULL,
    admin_id integer NOT NULL,
    descripcion text NOT NULL,
    nivel character varying(20) NOT NULL,
    recomendaciones text,
    CONSTRAINT rutinas_nivel_check CHECK (((nivel)::text = ANY ((ARRAY['principiante'::character varying, 'intermedio'::character varying, 'avanzado'::character varying])::text[])))
);


--
-- Name: rutinas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rutinas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: rutinas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rutinas_id_seq OWNED BY public.rutinas.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) DEFAULT 'cliente'::character varying NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['cliente'::character varying, 'admin'::character varying])::text[])))
);

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: carrito id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito ALTER COLUMN id SET DEFAULT nextval('public.carrito_id_seq'::regclass);


--
-- Name: historial_compras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_compras ALTER COLUMN id SET DEFAULT nextval('public.historial_compras_id_seq'::regclass);


--
-- Name: membresias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membresias ALTER COLUMN id SET DEFAULT nextval('public.membresias_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: rutinas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutinas ALTER COLUMN id SET DEFAULT nextval('public.rutinas_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.carrito (id, cliente_id, producto_id, cantidad, created_at, membresia_id) VALUES (91, 3, NULL, 1, '2025-02-05 23:00:02.288275', 3);
INSERT INTO public.carrito (id, cliente_id, producto_id, cantidad, created_at, membresia_id) VALUES (107, 6, 7, 1, '2025-02-10 15:21:29.736075', NULL);
INSERT INTO public.carrito (id, cliente_id, producto_id, cantidad, created_at, membresia_id) VALUES (108, 6, NULL, 1, '2025-02-10 15:21:34.590427', 1);


--
-- Data for Name: historial_compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.historial_compras (id, user_id, producto_id, membresia_id, cantidad, total, fecha) VALUES (3, 6, 8, NULL, 1, 24.99, '2025-02-06 14:43:36.82136');
INSERT INTO public.historial_compras (id, user_id, producto_id, membresia_id, cantidad, total, fecha) VALUES (4, 6, 8, NULL, 1, 24.99, '2025-02-06 14:44:04.13453');
INSERT INTO public.historial_compras (id, user_id, producto_id, membresia_id, cantidad, total, fecha) VALUES (5, 6, 7, NULL, 1, 44.99, '2025-02-06 15:09:05.418631');
INSERT INTO public.historial_compras (id, user_id, producto_id, membresia_id, cantidad, total, fecha) VALUES (6, 6, 7, NULL, 1, 44.99, '2025-02-10 15:21:02.325192');
INSERT INTO public.historial_compras (id, user_id, producto_id, membresia_id, cantidad, total, fecha) VALUES (7, 6, NULL, 3, 1, 70.00, '2025-02-10 15:21:02.340607');


--
-- Data for Name: membresias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.membresias (id, nombre, descripcion, precio, admin_id, imagen_url) VALUES (3, 'Plan VIP', 'Acceso completo más asesoría personal en entrenamientos.', 70.00, 1, 'https://www.seeds-gallery.shop/10767-large_default/estado-de-membresia-vip-descuentos-especiales-y-ofertas.jpg');
INSERT INTO public.membresias (id, nombre, descripcion, precio, admin_id, imagen_url) VALUES (1, 'Plan Básico', 'Acceso limitado a las instalaciones.', 25.00, 1, 'https://th.bing.com/th/id/OIP.NyFZq012qF8eAz8-g-HZ5wHaHa?rs=1&pid=ImgDetMain');
INSERT INTO public.membresias (id, nombre, descripcion, precio, admin_id, imagen_url) VALUES (2, 'Plan Premium', 'Acceso completo a todas las instalaciones y clases grupales.', 45.00, 1, 'https://www.snowmanpokerleague.com/wp-content/uploads/Premium-768x811.jpg');


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (7, 'Dragon Pharma Black Viper', 'Quemador de grasa termogénico de alta potencia para pérdida de peso.', 44.99, 12, 1, 'https://thesportshop.ec/wp-content/uploads/2024/08/NUTREX-CREATINA-DRIVE-SIN-SABOR-1000G.png');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (9, 'Dragon Pharma Dr. FEAAR', 'Aminoácidos esenciales con electrolitos para mejorar la hidratación y recuperación.', 29.99, 34, 1, 'https://dragonpharmalabs.com/cdn/shop/files/RENDERS-600X600-2023_0008_dr-feaar-v2-cherry-pomegranade-front_110x110@2x.png?v=1691501874');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (10, 'Dragon Pharma EAA', 'Aminoácidos esenciales para la síntesis de proteínas y recuperación muscular.', 34.99, 42, 1, 'https://dragonpharmalabs.com/cdn/shop/files/RENDERS-600X600-2023_0006_dr-feaar-v2-raspberry-lemonade-front_300x300.png?v=1691501874');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (1, 'Dragon Pharma Venom', 'Pre-entrenamiento de alta intensidad para energía, enfoque y resistencia.', 39.99, 49, 1, 'https://http2.mlstatic.com/D_NQ_NP_645402-MLU78130482162_082024-O.webp');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (4, 'Dragon Pharma Whey Isolate', 'Proteína aislada de alta calidad para apoyar el crecimiento muscular y la recuperación.', 49.99, 19, 1, 'https://thesportshop.ec/wp-content/uploads/2024/08/DRAGON-PHARMA-WHEYPHORM-ISOLATADA-5LB-CHOCOLATE-BLANCO-HELASO-DE-VAINILLA.png');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (3, 'Dragon Pharma Creatine', 'Creatina monohidratada para aumentar la fuerza muscular y la recuperación.', 19.99, 90, 1, 'https://dragonpharmalabs.com/cdn/shop/files/RENDERS-600X600-2023_0019_Mockup---Creatine-Proof---Dragon-Pharma---Sem-Fundo1_600x.png?v=1691502002');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (2, 'Dragon Pharma ATP Force', 'Suplemento para optimizar la producción de energía celular y aumentar la fuerza.', 27.99, 26, 1, 'https://dragonpharmalabs.com/cdn/shop/files/RENDERS-600X600-2023_0001_atp-force-v2-strawberry-lemonade-front_300x300.png?v=1697047885');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (5, 'Dragon Pharma Alpha-AF', 'Fórmula para optimizar la testosterona y apoyar el rendimiento físico.', 54.99, 35, 1, 'https://dragonpharmalabs.com/cdn/shop/files/RENDERS-600X600-2023_0005_dr-feaar-v2-peach-guava-front_300x300.png?v=1691501874');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (6, 'Dragon Pharma Mr. Veinz', 'Suplemento para promover bombeos musculares intensos y mayor vascularización.', 34.99, 18, 1, 'https://m.media-amazon.com/images/I/718iPKj8xiL.jpg');
INSERT INTO public.productos (id, nombre, descripcion, precio, stock, admin_id, imagen_url) VALUES (8, 'Dragon Pharma Glutamine', 'Glutamina micronizada para mejorar la recuperación muscular y el sistema inmune.', 24.99, 56, 1, 'https://cdn.shopify.com/s/files/1/0009/3401/9129/files/RENDERS-600X600-2023_0018_Mockup---Glutamine-Essentials---Dragon-Pharma---Sem-Fundo1_400x400.png?v=1691501674');


--
-- Data for Name: rutinas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (36, 'Lunes', 'Sentadillas', '4x12', 2, 'Fortalece piernas y glúteos.', 'intermedio', 'Asegúrate de calentar antes de comenzar');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (37, 'Martes', 'Press banca', '3x10', 2, 'Ejercicio para fortalecer el pecho.', 'avanzado', 'Usa un peso adecuado para tu nivel');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (38, 'Miércoles', 'Zancadas', '3x15', 2, 'Mejora el equilibrio y trabaja glúteos.', 'principiante', 'Mantén la espalda recta');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (40, 'Viernes', 'Plancha abdominal', '3x1min', 2, 'Trabaja el core.', 'intermedio', 'Respira de manera controlada');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (41, 'Sábado', 'Correr', '5km', 2, 'Cardio para mejorar resistencia cardiovascular.', 'intermedio', 'Hidrátate antes y después');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (42, 'Domingo', 'Yoga', '45min', 2, 'Relajación y mejora de flexibilidad.', 'principiante', 'Usa ropa cómoda y esterilla');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (43, 'Lunes', 'Peso muerto', '4x10', 2, 'Fortalece la zona lumbar y piernas.', 'intermedio', 'Mantén una buena técnica');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (44, 'Martes', 'Curl de bíceps', '3x12', 2, 'Fortalece los brazos.', 'principiante', 'Usa mancuernas adecuadas');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (45, 'Miércoles', 'Press militar', '3x8', 2, 'Fortalece los hombros.', 'avanzado', 'Evita arquear la espalda');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (46, 'Jueves', 'Burpees', '3x15', 2, 'Ejercicio de cuerpo completo.', 'intermedio', 'Mantén el ritmo constante');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (47, 'Viernes', 'Flexiones', '4x20', 2, 'Fortalece el pecho y tríceps.', 'principiante', 'Mantén la espalda recta');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (48, 'Sábado', 'Bicicleta estática', '30min', 2, 'Cardio para piernas.', 'intermedio', 'Mantén una resistencia adecuada');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (49, 'Domingo', 'Remo con barra', '3x10', 2, 'Fortalece la espalda y los brazos.', 'avanzado', 'Evita encorvarte');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (50, 'Lunes', 'Abdominales', '4x25', 2, 'Tonifica el abdomen.', 'principiante', 'Haz movimientos controlados');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (51, 'Martes', 'Press de pierna', '4x12', 2, 'Fortalece las piernas.', 'intermedio', 'Controla la bajada del peso');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (52, 'Miércoles', 'Escaladora', '20min', 2, 'Cardio intenso.', 'intermedio', 'Mantén una postura erguida');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (53, 'Jueves', 'Hip thrust', '4x10', 2, 'Fortalece glúteos.', 'avanzado', 'Evita extender demasiado la espalda');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (54, 'Viernes', 'Mountain climbers', '3x30seg', 2, 'Trabaja el core y piernas.', 'principiante', 'Mantén el ritmo constante');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (55, 'Sábado', 'Caminata inclinada', '30min', 2, 'Cardio moderado.', 'intermedio', 'Usa una inclinación adecuada');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (56, 'Domingo', 'Press inclinado', '4x12', 2, 'Fortalece el pecho superior.', 'avanzado', 'Evita bajar demasiado la barra');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (57, 'Lunes', 'Elevaciones laterales', '3x15', 2, 'Fortalece los hombros.', 'principiante', 'Evita movimientos bruscos');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (58, 'Martes', 'Sentadilla búlgara', '4x10', 2, 'Fortalece piernas y equilibrio.', 'intermedio', 'Usa una silla o banco estable');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (59, 'Miércoles', 'Pull-over', '3x12', 2, 'Trabaja pecho y dorsales.', 'intermedio', 'Mantén los brazos estirados');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (60, 'Jueves', 'Saltos de cuerda', '5min', 2, 'Cardio y coordinación.', 'principiante', 'Usa una cuerda de tu altura');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (61, 'Viernes', 'Tijeras abdominales', '4x20', 2, 'Trabaja el abdomen inferior.', 'intermedio', 'Mantén la espalda baja pegada al suelo');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (62, 'Sábado', 'Escalada en pared', '15min', 2, 'Ejercicio completo para el cuerpo.', 'avanzado', 'Usa equipo de seguridad');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (63, 'Domingo', 'Caminar', '5km', 2, 'Cardio suave para recuperación.', 'principiante', 'Usa calzado cómodo');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (64, 'Lunes', 'Press francés', '4x12', 2, 'Fortalece los tríceps.', 'intermedio', 'Usa un peso moderado');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (65, 'Martes', 'Hombros con mancuernas', '3x15', 2, 'Tonifica los hombros.', 'principiante', 'Evita mover el torso');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (66, 'Miércoles', 'Sentadilla con salto', '4x15', 2, 'Potencia las piernas.', 'avanzado', 'Aterriza suavemente para evitar lesiones');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (67, 'Jueves', 'Extensiones de pierna', '3x20', 2, 'Fortalece cuádriceps.', 'intermedio', 'Controla el movimiento en ambas direcciones');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (68, 'Viernes', 'Peso muerto rumano', '3x10', 2, 'Fortalece glúteos y espalda baja.', 'avanzado', 'Mantén la espalda recta');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (69, 'Sábado', 'Remo en máquina', '4x12', 2, 'Fortalece espalda y bíceps.', 'intermedio', 'Evita extender demasiado los codos');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (70, 'Domingo', 'Caminata rápida', '4km', 2, 'Cardio moderado.', 'principiante', 'Usa ropa y calzado cómodos');
INSERT INTO public.rutinas (id, dia, ejercicio, repeticiones, admin_id, descripcion, nivel, recomendaciones) VALUES (39, 'Jueves', 'Dominadas', '4x9', 2, 'Fortalece la espalda y bíceps.', 'avanzado', 'Evita balancearte al subir');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, nombre, email, password, role) VALUES (1, 'Henry', 'huambi123@gmail.com', '$2b$10$fNuRF4/xbdl9dIIpWori.uC2PJTcZkXchMh8/QM5FHHAzQDTYPeaS', 'cliente');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (2, 'Admin 1', 'admin1@example.com', 'password123', 'admin');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (4, 'Jhoss', 'Jhoss123@gmail.com', '$2b$10$OYQ3RgxEuFLXAx/yHwVXxulkiInBPNUyRXzxn4BSkM98beRFdHcIS', 'cliente');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (5, 'jhoss', 'dayana123@gmail.com', '$2b$10$WroFEbKinXlk.j1FZcUrSuWweFcokMSdYDFituzrYa//UFo6Gqu6a', 'cliente');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (3, 'Agusto', 'huambi@gmail.com', '$2b$10$MQaRejWW7FdW9eEYyvdIJeXPhDRHd1DWjLcWhdQaEfczuUe4oxaPy', 'admin');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (6, 'Erick', 'erick@gmail.com', '$2b$10$Yz6O1B71dPvs7eLWlopaLuT2ukQH04XfBIq2MstCpLhOGTTbpM1LC', 'cliente');
INSERT INTO public.users (id, nombre, email, password, role) VALUES (7, 'antonio', 'antonio@gmail.com', '$2b$10$AJrxWhuft4671OFfCRFqSu8oJ8UFNa7q1YltTzKoj3.g5bBmfcEmm', 'cliente');


--
-- Name: carrito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_id_seq', 108, true);


--
-- Name: historial_compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_compras_id_seq', 7, true);


--
-- Name: membresias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membresias_id_seq', 3, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 10, true);


--
-- Name: rutinas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rutinas_id_seq', 70, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: carrito carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id);


--
-- Name: historial_compras historial_compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_compras
    ADD CONSTRAINT historial_compras_pkey PRIMARY KEY (id);


--
-- Name: membresias membresias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membresias
    ADD CONSTRAINT membresias_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: rutinas rutinas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutinas
    ADD CONSTRAINT rutinas_pkey PRIMARY KEY (id);


--
-- Name: carrito unique_cliente_carrito; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT unique_cliente_carrito UNIQUE (cliente_id, producto_id, membresia_id);


--
-- Name: carrito unique_cliente_membresia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT unique_cliente_membresia UNIQUE (cliente_id, membresia_id);


--
-- Name: carrito unique_cliente_producto; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT unique_cliente_producto UNIQUE (cliente_id, producto_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: carrito carrito_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: carrito carrito_membresia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_membresia_id_fkey FOREIGN KEY (membresia_id) REFERENCES public.membresias(id) ON DELETE CASCADE;


--
-- Name: carrito carrito_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: historial_compras historial_compras_membresia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_compras
    ADD CONSTRAINT historial_compras_membresia_id_fkey FOREIGN KEY (membresia_id) REFERENCES public.membresias(id) ON DELETE SET NULL;


--
-- Name: historial_compras historial_compras_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_compras
    ADD CONSTRAINT historial_compras_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE SET NULL;


--
-- Name: historial_compras historial_compras_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_compras
    ADD CONSTRAINT historial_compras_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: membresias membresias_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membresias
    ADD CONSTRAINT membresias_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: productos productos_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: rutinas rutinas_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutinas
    ADD CONSTRAINT rutinas_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

