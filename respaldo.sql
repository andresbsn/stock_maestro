--
-- PostgreSQL database dump
--

\restrict AGUNe9KthOzio1mFbtI5FgaTUL54Y6FX4r7SmaQnoVA3g187BVJeUkyydWHXXSA

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

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

DROP DATABASE inventario_circuito_pm;
--
-- Name: inventario_circuito_pm; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE inventario_circuito_pm WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Argentina.1252';


ALTER DATABASE inventario_circuito_pm OWNER TO postgres;

\unrestrict AGUNe9KthOzio1mFbtI5FgaTUL54Y6FX4r7SmaQnoVA3g187BVJeUkyydWHXXSA
\connect inventario_circuito_pm
\restrict AGUNe9KthOzio1mFbtI5FgaTUL54Y6FX4r7SmaQnoVA3g187BVJeUkyydWHXXSA

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

--
-- Name: enum_Cajas_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Cajas_estado" AS ENUM (
    'ABIERTA',
    'CERRADA'
);


ALTER TYPE public."enum_Cajas_estado" OWNER TO postgres;

--
-- Name: enum_MovimientoStocks_scope; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_MovimientoStocks_scope" AS ENUM (
    'GENERAL',
    'COMPLEJO'
);


ALTER TYPE public."enum_MovimientoStocks_scope" OWNER TO postgres;

--
-- Name: enum_OrdenTransferencia_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_OrdenTransferencia_estado" AS ENUM (
    'BORRADOR',
    'CONFIRMADA',
    'CANCELADA'
);


ALTER TYPE public."enum_OrdenTransferencia_estado" OWNER TO postgres;

--
-- Name: enum_Torneos_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Torneos_estado" AS ENUM (
    'ACTIVO',
    'FINALIZADO'
);


ALTER TYPE public."enum_Torneos_estado" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'ADMIN',
    'COMPLEJO'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

--
-- Name: enum_VentaItems_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_VentaItems_tipo" AS ENUM (
    'GANANCIA',
    'GASTO'
);


ALTER TYPE public."enum_VentaItems_tipo" OWNER TO postgres;

--
-- Name: enum_Venta_metodo_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Venta_metodo_pago" AS ENUM (
    'EFECTIVO',
    'TRANSFERENCIA',
    'TARJETA',
    'QR',
    'OTRO',
    'CORTESIA'
);


ALTER TYPE public."enum_Venta_metodo_pago" OWNER TO postgres;

--
-- Name: enum_torneos_estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_torneos_estado AS ENUM (
    'ACTIVO',
    'FINALIZADO'
);


ALTER TYPE public.enum_torneos_estado OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cajas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cajas" (
    id integer NOT NULL,
    estado public."enum_Cajas_estado" DEFAULT 'ABIERTA'::public."enum_Cajas_estado",
    monto_inicial numeric(10,2) DEFAULT 0,
    monto_final numeric(10,2),
    opened_at timestamp with time zone,
    closed_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    torneo_id integer,
    complejo_id integer,
    opened_by integer,
    closed_by integer
);


ALTER TABLE public."Cajas" OWNER TO postgres;

--
-- Name: Cajas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cajas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cajas_id_seq" OWNER TO postgres;

--
-- Name: Cajas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cajas_id_seq" OWNED BY public."Cajas".id;


--
-- Name: Complejos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Complejos" (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    direccion character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Complejos" OWNER TO postgres;

--
-- Name: Complejos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Complejos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Complejos_id_seq" OWNER TO postgres;

--
-- Name: Complejos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Complejos_id_seq" OWNED BY public."Complejos".id;


--
-- Name: DevolucionItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DevolucionItems" (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario_snapshot numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    devolucion_id integer NOT NULL
);


ALTER TABLE public."DevolucionItems" OWNER TO postgres;

--
-- Name: DevolucionItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DevolucionItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DevolucionItems_id_seq" OWNER TO postgres;

--
-- Name: DevolucionItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DevolucionItems_id_seq" OWNED BY public."DevolucionItems".id;


--
-- Name: Devolucions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Devolucions" (
    id integer NOT NULL,
    created_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    caja_id integer NOT NULL,
    created_by integer NOT NULL
);


ALTER TABLE public."Devolucions" OWNER TO postgres;

--
-- Name: Devolucions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Devolucions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Devolucions_id_seq" OWNER TO postgres;

--
-- Name: Devolucions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Devolucions_id_seq" OWNED BY public."Devolucions".id;


--
-- Name: Gastos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Gastos" (
    id integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    descripcion character varying(255) NOT NULL,
    categoria character varying(255),
    created_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    caja_id integer NOT NULL,
    created_by integer NOT NULL
);


ALTER TABLE public."Gastos" OWNER TO postgres;

--
-- Name: Gastos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Gastos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Gastos_id_seq" OWNER TO postgres;

--
-- Name: Gastos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Gastos_id_seq" OWNED BY public."Gastos".id;


--
-- Name: InventarioComplejos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventarioComplejos" (
    id integer NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    producto_id integer,
    complejo_id integer
);


ALTER TABLE public."InventarioComplejos" OWNER TO postgres;

--
-- Name: InventarioComplejos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InventarioComplejos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."InventarioComplejos_id_seq" OWNER TO postgres;

--
-- Name: InventarioComplejos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InventarioComplejos_id_seq" OWNED BY public."InventarioComplejos".id;


--
-- Name: InventarioGenerals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventarioGenerals" (
    id integer NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    producto_id integer
);


ALTER TABLE public."InventarioGenerals" OWNER TO postgres;

--
-- Name: InventarioGenerals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InventarioGenerals_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."InventarioGenerals_id_seq" OWNER TO postgres;

--
-- Name: InventarioGenerals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InventarioGenerals_id_seq" OWNED BY public."InventarioGenerals".id;


--
-- Name: MovimientoStocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovimientoStocks" (
    id integer NOT NULL,
    scope public."enum_MovimientoStocks_scope" NOT NULL,
    tipo character varying(255) NOT NULL,
    cantidad_signed integer NOT NULL,
    stock_resultante integer NOT NULL,
    ref_tipo character varying(255),
    ref_id integer,
    created_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    producto_id integer,
    complejo_id integer,
    torneo_id integer,
    created_by integer
);


ALTER TABLE public."MovimientoStocks" OWNER TO postgres;

--
-- Name: MovimientoStocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MovimientoStocks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MovimientoStocks_id_seq" OWNER TO postgres;

--
-- Name: MovimientoStocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MovimientoStocks_id_seq" OWNED BY public."MovimientoStocks".id;


--
-- Name: NotaCompraItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotaCompraItems" (
    id integer NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario_snapshot numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    nota_id integer,
    producto_id integer
);


ALTER TABLE public."NotaCompraItems" OWNER TO postgres;

--
-- Name: NotaCompraItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NotaCompraItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NotaCompraItems_id_seq" OWNER TO postgres;

--
-- Name: NotaCompraItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NotaCompraItems_id_seq" OWNED BY public."NotaCompraItems".id;


--
-- Name: NotaCompras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotaCompras" (
    id integer NOT NULL,
    fecha timestamp with time zone,
    proveedor character varying(255),
    observaciones text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    created_by integer
);


ALTER TABLE public."NotaCompras" OWNER TO postgres;

--
-- Name: NotaCompras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NotaCompras_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NotaCompras_id_seq" OWNER TO postgres;

--
-- Name: NotaCompras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NotaCompras_id_seq" OWNED BY public."NotaCompras".id;


--
-- Name: OrdenTransferencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrdenTransferencia" (
    id integer NOT NULL,
    estado public."enum_OrdenTransferencia_estado" DEFAULT 'BORRADOR'::public."enum_OrdenTransferencia_estado",
    fecha timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    complejo_id integer,
    created_by integer,
    es_gasto boolean DEFAULT false
);


ALTER TABLE public."OrdenTransferencia" OWNER TO postgres;

--
-- Name: OrdenTransferenciaItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrdenTransferenciaItems" (
    id integer NOT NULL,
    cantidad integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    orden_id integer,
    producto_id integer,
    es_gasto boolean DEFAULT false
);


ALTER TABLE public."OrdenTransferenciaItems" OWNER TO postgres;

--
-- Name: OrdenTransferenciaItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrdenTransferenciaItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrdenTransferenciaItems_id_seq" OWNER TO postgres;

--
-- Name: OrdenTransferenciaItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrdenTransferenciaItems_id_seq" OWNED BY public."OrdenTransferenciaItems".id;


--
-- Name: OrdenTransferencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrdenTransferencia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrdenTransferencia_id_seq" OWNER TO postgres;

--
-- Name: OrdenTransferencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrdenTransferencia_id_seq" OWNED BY public."OrdenTransferencia".id;


--
-- Name: Productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Productos" (
    id integer NOT NULL,
    sku character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    unidad character varying(255) DEFAULT 'un'::character varying,
    costo_unitario numeric(10,2) DEFAULT 0,
    precio_venta_unitario numeric(10,2) DEFAULT 0,
    activo boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    solo_admin boolean DEFAULT false
);


ALTER TABLE public."Productos" OWNER TO postgres;

--
-- Name: Productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Productos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Productos_id_seq" OWNER TO postgres;

--
-- Name: Productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Productos_id_seq" OWNED BY public."Productos".id;


--
-- Name: Torneos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Torneos" (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    estado public."enum_Torneos_estado" DEFAULT 'ACTIVO'::public."enum_Torneos_estado",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Torneos" OWNER TO postgres;

--
-- Name: Torneos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Torneos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Torneos_id_seq" OWNER TO postgres;

--
-- Name: Torneos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Torneos_id_seq" OWNED BY public."Torneos".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'COMPLEJO'::public."enum_Users_role",
    active boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    complejo_id integer
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Venta" (
    id integer NOT NULL,
    total numeric(10,2) DEFAULT 0,
    metodo_pago public."enum_Venta_metodo_pago" DEFAULT 'EFECTIVO'::public."enum_Venta_metodo_pago",
    descuento_monto numeric(10,2) DEFAULT 0,
    descuento_porcentaje double precision DEFAULT '0'::double precision,
    created_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    caja_id integer,
    torneo_id integer,
    complejo_id integer,
    created_by integer,
    detalle_cortesia character varying(255),
    total_pagado numeric(10,2) DEFAULT 0,
    pagos json
);


ALTER TABLE public."Venta" OWNER TO postgres;

--
-- Name: VentaItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VentaItems" (
    id integer NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario_snapshot numeric(10,2) NOT NULL,
    precio_unitario_snapshot numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    ganancia numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    venta_id integer,
    producto_id integer,
    tipo public."enum_VentaItems_tipo" DEFAULT 'GANANCIA'::public."enum_VentaItems_tipo"
);


ALTER TABLE public."VentaItems" OWNER TO postgres;

--
-- Name: VentaItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VentaItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VentaItems_id_seq" OWNER TO postgres;

--
-- Name: VentaItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VentaItems_id_seq" OWNED BY public."VentaItems".id;


--
-- Name: Venta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Venta_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Venta_id_seq" OWNER TO postgres;

--
-- Name: Venta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Venta_id_seq" OWNED BY public."Venta".id;


--
-- Name: Cajas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas" ALTER COLUMN id SET DEFAULT nextval('public."Cajas_id_seq"'::regclass);


--
-- Name: Complejos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complejos" ALTER COLUMN id SET DEFAULT nextval('public."Complejos_id_seq"'::regclass);


--
-- Name: DevolucionItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DevolucionItems" ALTER COLUMN id SET DEFAULT nextval('public."DevolucionItems_id_seq"'::regclass);


--
-- Name: Devolucions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devolucions" ALTER COLUMN id SET DEFAULT nextval('public."Devolucions_id_seq"'::regclass);


--
-- Name: Gastos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gastos" ALTER COLUMN id SET DEFAULT nextval('public."Gastos_id_seq"'::regclass);


--
-- Name: InventarioComplejos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioComplejos" ALTER COLUMN id SET DEFAULT nextval('public."InventarioComplejos_id_seq"'::regclass);


--
-- Name: InventarioGenerals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioGenerals" ALTER COLUMN id SET DEFAULT nextval('public."InventarioGenerals_id_seq"'::regclass);


--
-- Name: MovimientoStocks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks" ALTER COLUMN id SET DEFAULT nextval('public."MovimientoStocks_id_seq"'::regclass);


--
-- Name: NotaCompraItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompraItems" ALTER COLUMN id SET DEFAULT nextval('public."NotaCompraItems_id_seq"'::regclass);


--
-- Name: NotaCompras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompras" ALTER COLUMN id SET DEFAULT nextval('public."NotaCompras_id_seq"'::regclass);


--
-- Name: OrdenTransferencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferencia" ALTER COLUMN id SET DEFAULT nextval('public."OrdenTransferencia_id_seq"'::regclass);


--
-- Name: OrdenTransferenciaItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferenciaItems" ALTER COLUMN id SET DEFAULT nextval('public."OrdenTransferenciaItems_id_seq"'::regclass);


--
-- Name: Productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos" ALTER COLUMN id SET DEFAULT nextval('public."Productos_id_seq"'::regclass);


--
-- Name: Torneos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Torneos" ALTER COLUMN id SET DEFAULT nextval('public."Torneos_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: Venta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta" ALTER COLUMN id SET DEFAULT nextval('public."Venta_id_seq"'::regclass);


--
-- Name: VentaItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VentaItems" ALTER COLUMN id SET DEFAULT nextval('public."VentaItems_id_seq"'::regclass);


--
-- Data for Name: Cajas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cajas" (id, estado, monto_inicial, monto_final, opened_at, closed_at, "createdAt", "updatedAt", torneo_id, complejo_id, opened_by, closed_by) FROM stdin;
7	ABIERTA	5000.00	\N	2026-03-12 09:52:01.926-03	\N	2026-03-12 09:52:01.927-03	2026-03-12 09:52:01.927-03	5	2	3	\N
6	CERRADA	0.00	3000.00	2026-02-05 14:54:31.26-03	2026-03-12 10:26:48.676-03	2026-02-05 14:54:31.261-03	2026-03-12 10:26:48.677-03	5	1	2	2
\.


--
-- Data for Name: Complejos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Complejos" (id, nombre, direccion, "createdAt", "updatedAt") FROM stdin;
1	Complejo Central	Av. Principal 123	2026-01-26 10:03:48.158-03	2026-01-26 10:03:48.158-03
2	Complejo Norte	Calle Norte 456	2026-01-26 10:03:48.16-03	2026-01-26 10:03:48.16-03
\.


--
-- Data for Name: DevolucionItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DevolucionItems" (id, producto_id, cantidad, costo_unitario_snapshot, subtotal, "createdAt", "updatedAt", devolucion_id) FROM stdin;
\.


--
-- Data for Name: Devolucions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Devolucions" (id, created_at, "createdAt", "updatedAt", caja_id, created_by) FROM stdin;
\.


--
-- Data for Name: Gastos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Gastos" (id, monto, descripcion, categoria, created_at, "createdAt", "updatedAt", caja_id, created_by) FROM stdin;
\.


--
-- Data for Name: InventarioComplejos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventarioComplejos" (id, stock, "createdAt", "updatedAt", producto_id, complejo_id) FROM stdin;
2	20	2026-02-05 14:53:13.422-03	2026-02-05 14:53:13.434-03	2	1
4	20	2026-02-06 10:51:58.387-03	2026-02-06 10:51:58.453-03	2	2
5	50	2026-02-06 10:51:58.47-03	2026-02-06 10:51:58.475-03	3	2
3	13	2026-02-05 14:53:13.451-03	2026-03-11 00:18:04.255-03	1	1
\.


--
-- Data for Name: InventarioGenerals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventarioGenerals" (id, stock, "createdAt", "updatedAt", producto_id) FROM stdin;
1	385	2026-01-26 10:03:48.319-03	2026-02-06 10:45:18.108-03	1
3	173	2026-01-26 10:03:48.337-03	2026-02-09 10:40:48.12-03	3
2	123	2026-01-26 10:03:48.329-03	2026-02-09 10:40:48.133-03	2
\.


--
-- Data for Name: MovimientoStocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovimientoStocks" (id, scope, tipo, cantidad_signed, stock_resultante, ref_tipo, ref_id, created_at, "createdAt", "updatedAt", producto_id, complejo_id, torneo_id, created_by) FROM stdin;
10	GENERAL	TRANSFER_OUT_GENERAL	-20	130	OrdenTransferencia	5	2026-02-05 14:53:13.41-03	2026-02-05 14:53:13.41-03	2026-02-05 14:53:13.41-03	2	\N	\N	1
11	COMPLEJO	TRANSFER_IN_COMPLEX	20	20	OrdenTransferencia	5	2026-02-05 14:53:13.439-03	2026-02-05 14:53:13.439-03	2026-02-05 14:53:13.439-03	2	1	\N	1
12	GENERAL	TRANSFER_OUT_GENERAL	-15	185	OrdenTransferencia	5	2026-02-05 14:53:13.446-03	2026-02-05 14:53:13.446-03	2026-02-05 14:53:13.446-03	1	\N	\N	1
13	COMPLEJO	TRANSFER_IN_COMPLEX	15	15	OrdenTransferencia	5	2026-02-05 14:53:13.457-03	2026-02-05 14:53:13.457-03	2026-02-05 14:53:13.457-03	1	1	\N	1
14	COMPLEJO	SALE_OUT	-1	14	Venta	3	2026-02-05 14:54:50.66-03	2026-02-05 14:54:50.66-03	2026-02-05 14:54:50.66-03	1	1	5	2
15	GENERAL	PURCHASE_IN	200	385	NotaCompra	3	2026-02-06 10:45:18.112-03	2026-02-06 10:45:18.113-03	2026-02-06 10:45:18.113-03	1	\N	\N	1
16	GENERAL	TRANSFER_OUT_GENERAL	-20	110	OrdenTransferencia	6	2026-02-06 10:51:58.376-03	2026-02-06 10:51:58.376-03	2026-02-06 10:51:58.376-03	2	\N	\N	1
17	COMPLEJO	TRANSFER_IN_COMPLEX	20	20	OrdenTransferencia	6	2026-02-06 10:51:58.456-03	2026-02-06 10:51:58.456-03	2026-02-06 10:51:58.456-03	2	2	\N	1
18	GENERAL	TRANSFER_OUT_GENERAL	-50	150	OrdenTransferencia	6	2026-02-06 10:51:58.465-03	2026-02-06 10:51:58.465-03	2026-02-06 10:51:58.465-03	3	\N	\N	1
19	COMPLEJO	TRANSFER_IN_COMPLEX	50	50	OrdenTransferencia	6	2026-02-06 10:51:58.478-03	2026-02-06 10:51:58.478-03	2026-02-06 10:51:58.478-03	3	2	\N	1
20	GENERAL	PURCHASE_IN	23	173	NotaCompra	4	2026-02-09 10:40:48.122-03	2026-02-09 10:40:48.122-03	2026-02-09 10:40:48.122-03	3	\N	\N	1
21	GENERAL	PURCHASE_IN	13	123	NotaCompra	4	2026-02-09 10:40:48.136-03	2026-02-09 10:40:48.136-03	2026-02-09 10:40:48.136-03	2	\N	\N	1
22	COMPLEJO	SALE_OUT	-1	13	Venta	4	2026-03-11 00:18:04.265-03	2026-03-11 00:18:04.266-03	2026-03-11 00:18:04.266-03	1	1	5	2
\.


--
-- Data for Name: NotaCompraItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotaCompraItems" (id, cantidad, costo_unitario_snapshot, "createdAt", "updatedAt", nota_id, producto_id) FROM stdin;
7	200	900.00	2026-02-06 10:45:18.056-03	2026-02-06 10:45:18.056-03	3	1
8	23	6000.00	2026-02-09 10:40:48.098-03	2026-02-09 10:40:48.098-03	4	3
9	13	5500.00	2026-02-09 10:40:48.126-03	2026-02-09 10:40:48.126-03	4	2
\.


--
-- Data for Name: NotaCompras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotaCompras" (id, fecha, proveedor, observaciones, "createdAt", "updatedAt", created_by) FROM stdin;
1	2026-01-26 10:03:48.31-03	Proveedor Demo	Stock inicial seed	2026-01-26 10:03:48.31-03	2026-01-26 10:03:48.31-03	1
2	2026-02-05 10:10:18.382-03	Proveedor Demo	Stock inicial seed	2026-02-05 10:10:18.382-03	2026-02-05 10:10:18.382-03	1
3	2026-02-06 10:45:17.998-03			2026-02-06 10:45:18-03	2026-02-06 10:45:18-03	1
4	2026-02-09 10:40:48.057-03			2026-02-09 10:40:48.058-03	2026-02-09 10:40:48.058-03	1
\.


--
-- Data for Name: OrdenTransferencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrdenTransferencia" (id, estado, fecha, "createdAt", "updatedAt", complejo_id, created_by, es_gasto) FROM stdin;
5	CONFIRMADA	2026-02-05 14:53:11.056-03	2026-02-05 14:53:11.056-03	2026-02-05 14:53:13.459-03	1	1	f
6	CONFIRMADA	2026-02-06 10:51:52.405-03	2026-02-06 10:51:52.406-03	2026-02-06 10:51:58.48-03	2	1	f
7	BORRADOR	2026-03-11 00:08:33.638-03	2026-03-11 00:08:33.64-03	2026-03-11 00:08:33.64-03	2	1	f
8	BORRADOR	2026-03-12 10:29:41.38-03	2026-03-12 10:29:41.382-03	2026-03-12 10:29:41.382-03	1	1	t
\.


--
-- Data for Name: OrdenTransferenciaItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrdenTransferenciaItems" (id, cantidad, "createdAt", "updatedAt", orden_id, producto_id, es_gasto) FROM stdin;
5	20	2026-02-05 14:53:11.061-03	2026-02-05 14:53:11.061-03	5	2	f
6	15	2026-02-05 14:53:11.065-03	2026-02-05 14:53:11.065-03	5	1	f
7	20	2026-02-06 10:51:52.45-03	2026-02-06 10:51:52.45-03	6	2	f
8	50	2026-02-06 10:51:52.476-03	2026-02-06 10:51:52.476-03	6	3	f
9	5	2026-03-11 00:08:33.688-03	2026-03-11 00:08:33.688-03	7	2	f
10	50	2026-03-12 10:29:41.437-03	2026-03-12 10:29:41.437-03	8	2	f
\.


--
-- Data for Name: Productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Productos" (id, sku, nombre, unidad, costo_unitario, precio_venta_unitario, activo, "createdAt", "updatedAt", solo_admin) FROM stdin;
1	BEB-001	Coca Cola 500ml	un	900.00	1500.00	t	2026-01-26 10:03:48.294-03	2026-02-06 10:45:18.099-03	f
3	SNK-001	Papas Lays	un	6000.00	1200.00	t	2026-01-26 10:03:48.306-03	2026-02-09 10:40:48.111-03	f
2	BEB-002	Agua Mineral 500ml	un	5500.00	7500.00	t	2026-01-26 10:03:48.303-03	2026-02-09 10:41:19.546-03	f
\.


--
-- Data for Name: Torneos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Torneos" (id, nombre, fecha_inicio, fecha_fin, estado, created_at, updated_at) FROM stdin;
5	torneo prueba	2026-02-05	\N	ACTIVO	2026-02-05 14:52:58.657-03	2026-02-05 14:52:58.657-03
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, password_hash, role, active, "createdAt", "updatedAt", complejo_id) FROM stdin;
1	admin	$2b$10$fWvbqIN9PcW2AjAbKsB/R.x9wHvNc9IYhLRLPaiFC7/PpemBF6Mem	ADMIN	t	2026-01-26 10:03:48.145-03	2026-01-26 10:03:48.145-03	\N
2	user_1	$2b$10$qMYRKz0Usv83y4.z9yOaeOm/Y8RrVsvnoeXwzQnKunCHwlYYSfvR6	COMPLEJO	t	2026-01-26 10:03:48.226-03	2026-01-26 10:03:48.226-03	1
3	user_2	$2b$10$IMVUkpqpBM6s3mDRpw0Y1OO8CTyXQbk6uBWtbxv/eTFOzn1oCyOqa	COMPLEJO	t	2026-01-26 10:03:48.291-03	2026-01-26 10:03:48.291-03	2
\.


--
-- Data for Name: Venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Venta" (id, total, metodo_pago, descuento_monto, descuento_porcentaje, created_at, "createdAt", "updatedAt", caja_id, torneo_id, complejo_id, created_by, detalle_cortesia, total_pagado, pagos) FROM stdin;
3	1500.00	EFECTIVO	0.00	0	2026-02-05 14:54:50.619-03	2026-02-05 14:54:50.619-03	2026-02-05 14:54:50.664-03	6	5	1	2	\N	0.00	\N
4	1500.00	EFECTIVO	0.00	0	2026-03-11 00:18:04.191-03	2026-03-11 00:18:04.191-03	2026-03-11 00:18:04.274-03	6	5	1	2	\N	0.00	\N
\.


--
-- Data for Name: VentaItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VentaItems" (id, cantidad, costo_unitario_snapshot, precio_unitario_snapshot, subtotal, ganancia, "createdAt", "updatedAt", venta_id, producto_id, tipo) FROM stdin;
3	1	900.00	1500.00	1500.00	600.00	2026-02-05 14:54:50.651-03	2026-02-05 14:54:50.651-03	3	1	GANANCIA
4	1	900.00	1500.00	1500.00	600.00	2026-03-11 00:18:04.245-03	2026-03-11 00:18:04.245-03	4	1	GANANCIA
\.


--
-- Name: Cajas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cajas_id_seq"', 7, true);


--
-- Name: Complejos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Complejos_id_seq"', 2, true);


--
-- Name: DevolucionItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DevolucionItems_id_seq"', 1, false);


--
-- Name: Devolucions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Devolucions_id_seq"', 1, false);


--
-- Name: Gastos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Gastos_id_seq"', 1, false);


--
-- Name: InventarioComplejos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."InventarioComplejos_id_seq"', 5, true);


--
-- Name: InventarioGenerals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."InventarioGenerals_id_seq"', 3, true);


--
-- Name: MovimientoStocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MovimientoStocks_id_seq"', 22, true);


--
-- Name: NotaCompraItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NotaCompraItems_id_seq"', 9, true);


--
-- Name: NotaCompras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NotaCompras_id_seq"', 4, true);


--
-- Name: OrdenTransferenciaItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrdenTransferenciaItems_id_seq"', 10, true);


--
-- Name: OrdenTransferencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrdenTransferencia_id_seq"', 8, true);


--
-- Name: Productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Productos_id_seq"', 3, true);


--
-- Name: Torneos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Torneos_id_seq"', 5, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 3, true);


--
-- Name: VentaItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VentaItems_id_seq"', 4, true);


--
-- Name: Venta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Venta_id_seq"', 4, true);


--
-- Name: Cajas Cajas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_pkey" PRIMARY KEY (id);


--
-- Name: Complejos Complejos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complejos"
    ADD CONSTRAINT "Complejos_pkey" PRIMARY KEY (id);


--
-- Name: DevolucionItems DevolucionItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DevolucionItems"
    ADD CONSTRAINT "DevolucionItems_pkey" PRIMARY KEY (id);


--
-- Name: Devolucions Devolucions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devolucions"
    ADD CONSTRAINT "Devolucions_pkey" PRIMARY KEY (id);


--
-- Name: Gastos Gastos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gastos"
    ADD CONSTRAINT "Gastos_pkey" PRIMARY KEY (id);


--
-- Name: InventarioComplejos InventarioComplejos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioComplejos"
    ADD CONSTRAINT "InventarioComplejos_pkey" PRIMARY KEY (id);


--
-- Name: InventarioGenerals InventarioGenerals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioGenerals"
    ADD CONSTRAINT "InventarioGenerals_pkey" PRIMARY KEY (id);


--
-- Name: MovimientoStocks MovimientoStocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks"
    ADD CONSTRAINT "MovimientoStocks_pkey" PRIMARY KEY (id);


--
-- Name: NotaCompraItems NotaCompraItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompraItems"
    ADD CONSTRAINT "NotaCompraItems_pkey" PRIMARY KEY (id);


--
-- Name: NotaCompras NotaCompras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompras"
    ADD CONSTRAINT "NotaCompras_pkey" PRIMARY KEY (id);


--
-- Name: OrdenTransferenciaItems OrdenTransferenciaItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferenciaItems"
    ADD CONSTRAINT "OrdenTransferenciaItems_pkey" PRIMARY KEY (id);


--
-- Name: OrdenTransferencia OrdenTransferencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferencia"
    ADD CONSTRAINT "OrdenTransferencia_pkey" PRIMARY KEY (id);


--
-- Name: Productos Productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_pkey" PRIMARY KEY (id);


--
-- Name: Productos Productos_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key1" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key10" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key11" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key12" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key13" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key14" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key15" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key16" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key17" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key18" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key19" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key2" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key20" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key21" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key22" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key23" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key24" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key25" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key26" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key27" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key28" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key29" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key3" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key30" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key31" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key32" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key33" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key34" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key35" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key36" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key37" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key38" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key39" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key4" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key40" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key41" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key42" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key43" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key44" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key45" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key46" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key47" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key48" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key49" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key5" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key50" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key51" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key52" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key53" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key54" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key55" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key56" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key57" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key58" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key59" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key6" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key60" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key7" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key8" UNIQUE (sku);


--
-- Name: Productos Productos_sku_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_sku_key9" UNIQUE (sku);


--
-- Name: Torneos Torneos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Torneos"
    ADD CONSTRAINT "Torneos_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);


--
-- Name: Users Users_username_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key1" UNIQUE (username);


--
-- Name: Users Users_username_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key10" UNIQUE (username);


--
-- Name: Users Users_username_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key11" UNIQUE (username);


--
-- Name: Users Users_username_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key12" UNIQUE (username);


--
-- Name: Users Users_username_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key13" UNIQUE (username);


--
-- Name: Users Users_username_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key14" UNIQUE (username);


--
-- Name: Users Users_username_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key15" UNIQUE (username);


--
-- Name: Users Users_username_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key16" UNIQUE (username);


--
-- Name: Users Users_username_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key17" UNIQUE (username);


--
-- Name: Users Users_username_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key18" UNIQUE (username);


--
-- Name: Users Users_username_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key19" UNIQUE (username);


--
-- Name: Users Users_username_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key2" UNIQUE (username);


--
-- Name: Users Users_username_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key20" UNIQUE (username);


--
-- Name: Users Users_username_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key21" UNIQUE (username);


--
-- Name: Users Users_username_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key22" UNIQUE (username);


--
-- Name: Users Users_username_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key23" UNIQUE (username);


--
-- Name: Users Users_username_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key24" UNIQUE (username);


--
-- Name: Users Users_username_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key25" UNIQUE (username);


--
-- Name: Users Users_username_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key26" UNIQUE (username);


--
-- Name: Users Users_username_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key27" UNIQUE (username);


--
-- Name: Users Users_username_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key28" UNIQUE (username);


--
-- Name: Users Users_username_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key29" UNIQUE (username);


--
-- Name: Users Users_username_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key3" UNIQUE (username);


--
-- Name: Users Users_username_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key30" UNIQUE (username);


--
-- Name: Users Users_username_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key31" UNIQUE (username);


--
-- Name: Users Users_username_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key32" UNIQUE (username);


--
-- Name: Users Users_username_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key33" UNIQUE (username);


--
-- Name: Users Users_username_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key34" UNIQUE (username);


--
-- Name: Users Users_username_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key35" UNIQUE (username);


--
-- Name: Users Users_username_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key36" UNIQUE (username);


--
-- Name: Users Users_username_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key37" UNIQUE (username);


--
-- Name: Users Users_username_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key38" UNIQUE (username);


--
-- Name: Users Users_username_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key39" UNIQUE (username);


--
-- Name: Users Users_username_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key4" UNIQUE (username);


--
-- Name: Users Users_username_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key40" UNIQUE (username);


--
-- Name: Users Users_username_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key41" UNIQUE (username);


--
-- Name: Users Users_username_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key42" UNIQUE (username);


--
-- Name: Users Users_username_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key43" UNIQUE (username);


--
-- Name: Users Users_username_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key44" UNIQUE (username);


--
-- Name: Users Users_username_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key45" UNIQUE (username);


--
-- Name: Users Users_username_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key46" UNIQUE (username);


--
-- Name: Users Users_username_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key47" UNIQUE (username);


--
-- Name: Users Users_username_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key48" UNIQUE (username);


--
-- Name: Users Users_username_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key49" UNIQUE (username);


--
-- Name: Users Users_username_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key5" UNIQUE (username);


--
-- Name: Users Users_username_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key50" UNIQUE (username);


--
-- Name: Users Users_username_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key51" UNIQUE (username);


--
-- Name: Users Users_username_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key52" UNIQUE (username);


--
-- Name: Users Users_username_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key53" UNIQUE (username);


--
-- Name: Users Users_username_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key54" UNIQUE (username);


--
-- Name: Users Users_username_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key55" UNIQUE (username);


--
-- Name: Users Users_username_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key56" UNIQUE (username);


--
-- Name: Users Users_username_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key57" UNIQUE (username);


--
-- Name: Users Users_username_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key58" UNIQUE (username);


--
-- Name: Users Users_username_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key59" UNIQUE (username);


--
-- Name: Users Users_username_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key6" UNIQUE (username);


--
-- Name: Users Users_username_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key60" UNIQUE (username);


--
-- Name: Users Users_username_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key61" UNIQUE (username);


--
-- Name: Users Users_username_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key7" UNIQUE (username);


--
-- Name: Users Users_username_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key8" UNIQUE (username);


--
-- Name: Users Users_username_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key9" UNIQUE (username);


--
-- Name: VentaItems VentaItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VentaItems"
    ADD CONSTRAINT "VentaItems_pkey" PRIMARY KEY (id);


--
-- Name: Venta Venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta"
    ADD CONSTRAINT "Venta_pkey" PRIMARY KEY (id);


--
-- Name: Cajas Cajas_closed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_closed_by_fkey" FOREIGN KEY (closed_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Cajas Cajas_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Cajas Cajas_opened_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_opened_by_fkey" FOREIGN KEY (opened_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Cajas Cajas_torneo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cajas"
    ADD CONSTRAINT "Cajas_torneo_id_fkey" FOREIGN KEY (torneo_id) REFERENCES public."Torneos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DevolucionItems DevolucionItems_devolucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DevolucionItems"
    ADD CONSTRAINT "DevolucionItems_devolucion_id_fkey" FOREIGN KEY (devolucion_id) REFERENCES public."Devolucions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DevolucionItems DevolucionItems_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DevolucionItems"
    ADD CONSTRAINT "DevolucionItems_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE;


--
-- Name: Devolucions Devolucions_caja_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devolucions"
    ADD CONSTRAINT "Devolucions_caja_id_fkey" FOREIGN KEY (caja_id) REFERENCES public."Cajas"(id) ON UPDATE CASCADE;


--
-- Name: Devolucions Devolucions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devolucions"
    ADD CONSTRAINT "Devolucions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Gastos Gastos_caja_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gastos"
    ADD CONSTRAINT "Gastos_caja_id_fkey" FOREIGN KEY (caja_id) REFERENCES public."Cajas"(id) ON UPDATE CASCADE;


--
-- Name: Gastos Gastos_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gastos"
    ADD CONSTRAINT "Gastos_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: InventarioComplejos InventarioComplejos_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioComplejos"
    ADD CONSTRAINT "InventarioComplejos_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventarioComplejos InventarioComplejos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioComplejos"
    ADD CONSTRAINT "InventarioComplejos_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventarioGenerals InventarioGenerals_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventarioGenerals"
    ADD CONSTRAINT "InventarioGenerals_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MovimientoStocks MovimientoStocks_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks"
    ADD CONSTRAINT "MovimientoStocks_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MovimientoStocks MovimientoStocks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks"
    ADD CONSTRAINT "MovimientoStocks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MovimientoStocks MovimientoStocks_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks"
    ADD CONSTRAINT "MovimientoStocks_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MovimientoStocks MovimientoStocks_torneo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientoStocks"
    ADD CONSTRAINT "MovimientoStocks_torneo_id_fkey" FOREIGN KEY (torneo_id) REFERENCES public."Torneos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotaCompraItems NotaCompraItems_nota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompraItems"
    ADD CONSTRAINT "NotaCompraItems_nota_id_fkey" FOREIGN KEY (nota_id) REFERENCES public."NotaCompras"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotaCompraItems NotaCompraItems_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompraItems"
    ADD CONSTRAINT "NotaCompraItems_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotaCompras NotaCompras_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotaCompras"
    ADD CONSTRAINT "NotaCompras_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenTransferenciaItems OrdenTransferenciaItems_orden_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferenciaItems"
    ADD CONSTRAINT "OrdenTransferenciaItems_orden_id_fkey" FOREIGN KEY (orden_id) REFERENCES public."OrdenTransferencia"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenTransferenciaItems OrdenTransferenciaItems_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferenciaItems"
    ADD CONSTRAINT "OrdenTransferenciaItems_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenTransferencia OrdenTransferencia_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferencia"
    ADD CONSTRAINT "OrdenTransferencia_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenTransferencia OrdenTransferencia_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrdenTransferencia"
    ADD CONSTRAINT "OrdenTransferencia_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Users Users_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VentaItems VentaItems_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VentaItems"
    ADD CONSTRAINT "VentaItems_producto_id_fkey" FOREIGN KEY (producto_id) REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VentaItems VentaItems_venta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VentaItems"
    ADD CONSTRAINT "VentaItems_venta_id_fkey" FOREIGN KEY (venta_id) REFERENCES public."Venta"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Venta Venta_caja_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta"
    ADD CONSTRAINT "Venta_caja_id_fkey" FOREIGN KEY (caja_id) REFERENCES public."Cajas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Venta Venta_complejo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta"
    ADD CONSTRAINT "Venta_complejo_id_fkey" FOREIGN KEY (complejo_id) REFERENCES public."Complejos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Venta Venta_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta"
    ADD CONSTRAINT "Venta_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Venta Venta_torneo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venta"
    ADD CONSTRAINT "Venta_torneo_id_fkey" FOREIGN KEY (torneo_id) REFERENCES public."Torneos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict AGUNe9KthOzio1mFbtI5FgaTUL54Y6FX4r7SmaQnoVA3g187BVJeUkyydWHXXSA

