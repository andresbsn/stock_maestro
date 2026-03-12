--
-- PostgreSQL database dump
--

\restrict mD3ggVrH0RES9rasFgdZ354yUPxr5jaKoycFUesqo3ZhGaDFxzN8c6hAU7cuMe1

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

--
-- Name: gestion_ventas; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA gestion_ventas;


ALTER SCHEMA gestion_ventas OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeData; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas."SequelizeData" (
    name character varying(255) NOT NULL
);


ALTER TABLE gestion_ventas."SequelizeData" OWNER TO postgres;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE gestion_ventas."SequelizeMeta" OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.audit_logs (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer,
    action character varying(20) NOT NULL,
    old_values jsonb,
    new_values jsonb,
    user_id integer,
    ip_address character varying(45),
    user_agent character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE gestion_ventas.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.audit_logs_id_seq OWNED BY gestion_ventas.audit_logs.id;


--
-- Name: cash_movements; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.cash_movements (
    id integer NOT NULL,
    cash_register_id integer NOT NULL,
    type character varying(255) NOT NULL,
    amount numeric(14,2) NOT NULL,
    payment_method character varying(255) NOT NULL,
    expense_category_id integer,
    reference_type character varying(255),
    reference_id integer,
    description text,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.cash_movements OWNER TO postgres;

--
-- Name: cash_movements_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.cash_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.cash_movements_id_seq OWNER TO postgres;

--
-- Name: cash_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.cash_movements_id_seq OWNED BY gestion_ventas.cash_movements.id;


--
-- Name: cash_registers; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.cash_registers (
    id integer NOT NULL,
    date date NOT NULL,
    user_id integer NOT NULL,
    status character varying(255) NOT NULL,
    opening_balance numeric(14,2) DEFAULT 0 NOT NULL,
    closing_balance numeric(14,2),
    closed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.cash_registers OWNER TO postgres;

--
-- Name: cash_registers_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.cash_registers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.cash_registers_id_seq OWNER TO postgres;

--
-- Name: cash_registers_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.cash_registers_id_seq OWNED BY gestion_ventas.cash_registers.id;


--
-- Name: client_account_movements; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.client_account_movements (
    id integer NOT NULL,
    client_id integer NOT NULL,
    type character varying(255) NOT NULL,
    amount numeric(14,2) NOT NULL,
    reference_type character varying(255) NOT NULL,
    reference_id integer,
    notes text,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.client_account_movements OWNER TO postgres;

--
-- Name: client_account_movements_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.client_account_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.client_account_movements_id_seq OWNER TO postgres;

--
-- Name: client_account_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.client_account_movements_id_seq OWNED BY gestion_ventas.client_account_movements.id;


--
-- Name: clients; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.clients (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    document character varying(255) NOT NULL,
    phone character varying(255),
    email character varying(255),
    address character varying(255),
    tax_condition character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE gestion_ventas.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.clients_id_seq OWNED BY gestion_ventas.clients.id;


--
-- Name: credit_note_items; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.credit_note_items (
    id integer NOT NULL,
    credit_note_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL
);


ALTER TABLE gestion_ventas.credit_note_items OWNER TO postgres;

--
-- Name: credit_note_items_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.credit_note_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.credit_note_items_id_seq OWNER TO postgres;

--
-- Name: credit_note_items_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.credit_note_items_id_seq OWNED BY gestion_ventas.credit_note_items.id;


--
-- Name: credit_notes; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.credit_notes (
    id integer NOT NULL,
    sale_id integer,
    client_id integer,
    status character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    return_to_stock boolean DEFAULT true NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.credit_notes OWNER TO postgres;

--
-- Name: credit_notes_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.credit_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.credit_notes_id_seq OWNER TO postgres;

--
-- Name: credit_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.credit_notes_id_seq OWNED BY gestion_ventas.credit_notes.id;


--
-- Name: expense_categories; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.expense_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.expense_categories OWNER TO postgres;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.expense_categories_id_seq OWNER TO postgres;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.expense_categories_id_seq OWNED BY gestion_ventas.expense_categories.id;


--
-- Name: permissions; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.permissions (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    module character varying(255) NOT NULL,
    description character varying(255)
);


ALTER TABLE gestion_ventas.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.permissions_id_seq OWNED BY gestion_ventas.permissions.id;


--
-- Name: product_categories; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.product_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.product_categories OWNER TO postgres;

--
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.product_categories_id_seq OWNER TO postgres;

--
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.product_categories_id_seq OWNED BY gestion_ventas.product_categories.id;


--
-- Name: products; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.products (
    id integer NOT NULL,
    sku character varying(255) NOT NULL,
    barcode character varying(255),
    name character varying(255) NOT NULL,
    description text,
    category_id integer,
    unit character varying(255) NOT NULL,
    location character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    stock_min integer DEFAULT 0 NOT NULL,
    stock_current integer DEFAULT 0 NOT NULL,
    tax_rate numeric(10,2) DEFAULT 0 NOT NULL,
    cost numeric(14,2) DEFAULT 0 NOT NULL,
    price_retail numeric(14,2) DEFAULT 0 NOT NULL,
    price_wholesale numeric(14,2) DEFAULT 0 NOT NULL,
    price_promo numeric(14,2),
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE gestion_ventas.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.products_id_seq OWNED BY gestion_ventas.products.id;


--
-- Name: purchase_order_items; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.purchase_order_items (
    id integer NOT NULL,
    purchase_order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_cost numeric(14,2) NOT NULL,
    tax_rate numeric(10,2),
    subtotal numeric(14,2) NOT NULL
);


ALTER TABLE gestion_ventas.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.purchase_order_items_id_seq OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.purchase_order_items_id_seq OWNED BY gestion_ventas.purchase_order_items.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.purchase_orders (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    status character varying(255) NOT NULL,
    order_date date NOT NULL,
    expected_date date,
    notes text,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.purchase_orders OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.purchase_orders_id_seq OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.purchase_orders_id_seq OWNED BY gestion_ventas.purchase_orders.id;


--
-- Name: purchase_receipt_items; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.purchase_receipt_items (
    id integer NOT NULL,
    purchase_receipt_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity_received integer NOT NULL,
    unit_cost numeric(14,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL
);


ALTER TABLE gestion_ventas.purchase_receipt_items OWNER TO postgres;

--
-- Name: purchase_receipt_items_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.purchase_receipt_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.purchase_receipt_items_id_seq OWNER TO postgres;

--
-- Name: purchase_receipt_items_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.purchase_receipt_items_id_seq OWNED BY gestion_ventas.purchase_receipt_items.id;


--
-- Name: purchase_receipts; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.purchase_receipts (
    id integer NOT NULL,
    purchase_order_id integer NOT NULL,
    receipt_date timestamp with time zone NOT NULL,
    status character varying(255) NOT NULL,
    notes text,
    received_by integer NOT NULL
);


ALTER TABLE gestion_ventas.purchase_receipts OWNER TO postgres;

--
-- Name: purchase_receipts_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.purchase_receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.purchase_receipts_id_seq OWNER TO postgres;

--
-- Name: purchase_receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.purchase_receipts_id_seq OWNED BY gestion_ventas.purchase_receipts.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.refresh_tokens_id_seq OWNED BY gestion_ventas.refresh_tokens.id;


--
-- Name: role_permissions; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE gestion_ventas.role_permissions OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.role_permissions_id_seq OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.role_permissions_id_seq OWNED BY gestion_ventas.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255)
);


ALTER TABLE gestion_ventas.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.roles_id_seq OWNED BY gestion_ventas.roles.id;


--
-- Name: sale_items; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.sale_items (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    unit_cost_snapshot numeric(14,2) NOT NULL,
    discount numeric(14,2) DEFAULT 0 NOT NULL,
    tax_rate numeric(10,2) DEFAULT 0 NOT NULL,
    subtotal numeric(14,2) NOT NULL
);


ALTER TABLE gestion_ventas.sale_items OWNER TO postgres;

--
-- Name: sale_items_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.sale_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.sale_items_id_seq OWNER TO postgres;

--
-- Name: sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.sale_items_id_seq OWNED BY gestion_ventas.sale_items.id;


--
-- Name: sales; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.sales (
    id integer NOT NULL,
    client_id integer,
    status character varying(255) NOT NULL,
    sale_date timestamp with time zone NOT NULL,
    payment_type character varying(255) NOT NULL,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    discount_total numeric(14,2) DEFAULT 0 NOT NULL,
    tax_total numeric(14,2) DEFAULT 0 NOT NULL,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    notes text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.sales OWNER TO postgres;

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.sales_id_seq OWNER TO postgres;

--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.sales_id_seq OWNED BY gestion_ventas.sales.id;


--
-- Name: stock_movements; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.stock_movements (
    id integer NOT NULL,
    product_id integer NOT NULL,
    type character varying(255) NOT NULL,
    quantity integer NOT NULL,
    unit_cost numeric(14,2),
    unit_price numeric(14,2),
    reference_type character varying(255) NOT NULL,
    reference_id integer,
    notes text,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.stock_movements OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.stock_movements_id_seq OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.stock_movements_id_seq OWNED BY gestion_ventas.stock_movements.id;


--
-- Name: supplier_account_movements; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.supplier_account_movements (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    type character varying(255) NOT NULL,
    amount numeric(14,2) NOT NULL,
    reference_type character varying(255) NOT NULL,
    reference_id integer,
    notes text,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.supplier_account_movements OWNER TO postgres;

--
-- Name: supplier_account_movements_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.supplier_account_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.supplier_account_movements_id_seq OWNER TO postgres;

--
-- Name: supplier_account_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.supplier_account_movements_id_seq OWNED BY gestion_ventas.supplier_account_movements.id;


--
-- Name: suppliers; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.suppliers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    document character varying(255) NOT NULL,
    contact_name character varying(255),
    phone character varying(255),
    email character varying(255),
    address character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE gestion_ventas.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.suppliers_id_seq OWNED BY gestion_ventas.suppliers.id;


--
-- Name: user_roles; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE gestion_ventas.user_roles OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.user_roles_id_seq OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.user_roles_id_seq OWNED BY gestion_ventas.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: gestion_ventas; Owner: postgres
--

CREATE TABLE gestion_ventas.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp with time zone,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE gestion_ventas.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: gestion_ventas; Owner: postgres
--

CREATE SEQUENCE gestion_ventas.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE gestion_ventas.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: gestion_ventas; Owner: postgres
--

ALTER SEQUENCE gestion_ventas.users_id_seq OWNED BY gestion_ventas.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.audit_logs ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.audit_logs_id_seq'::regclass);


--
-- Name: cash_movements id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_movements ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.cash_movements_id_seq'::regclass);


--
-- Name: cash_registers id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_registers ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.cash_registers_id_seq'::regclass);


--
-- Name: client_account_movements id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.client_account_movements ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.client_account_movements_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.clients ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.clients_id_seq'::regclass);


--
-- Name: credit_note_items id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_note_items ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.credit_note_items_id_seq'::regclass);


--
-- Name: credit_notes id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_notes ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.credit_notes_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.expense_categories ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.expense_categories_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.permissions ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.permissions_id_seq'::regclass);


--
-- Name: product_categories id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.product_categories ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.product_categories_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.products ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.products_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_orders ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.purchase_orders_id_seq'::regclass);


--
-- Name: purchase_receipt_items id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipt_items ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.purchase_receipt_items_id_seq'::regclass);


--
-- Name: purchase_receipts id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipts ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.purchase_receipts_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.refresh_tokens_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.role_permissions ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.roles ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.roles_id_seq'::regclass);


--
-- Name: sale_items id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sale_items ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.sale_items_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sales ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.sales_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.stock_movements ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.stock_movements_id_seq'::regclass);


--
-- Name: supplier_account_movements id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.supplier_account_movements ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.supplier_account_movements_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.suppliers ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.suppliers_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.user_roles ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.users ALTER COLUMN id SET DEFAULT nextval('gestion_ventas.users_id_seq'::regclass);


--
-- Data for Name: SequelizeData; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas."SequelizeData" (name) FROM stdin;
20260113000200-seed-roles-permissions-admin.cjs
20260113000500-seed-expense-categories.cjs
20260113000600-assign-sales-permissions-to-sales-role.cjs
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas."SequelizeMeta" (name) FROM stdin;
20260113000100-create-security-tables.cjs
20260113000300-create-products-stock.cjs
20260113000400-create-cash.cjs
20260113000600-create-clients-sales.cjs
20260113000700-create-suppliers-purchases.cjs
20260113000800-create-credit-notes.cjs
20260113120000-create-audit-logs.cjs
20260113120100-add-audit-permission.cjs
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.audit_logs (id, entity_type, entity_id, action, old_values, new_values, user_id, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: cash_movements; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.cash_movements (id, cash_register_id, type, amount, payment_method, expense_category_id, reference_type, reference_id, description, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: cash_registers; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.cash_registers (id, date, user_id, status, opening_balance, closing_balance, closed_at, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: client_account_movements; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.client_account_movements (id, client_id, type, amount, reference_type, reference_id, notes, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.clients (id, name, document, phone, email, address, tax_condition, is_active, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: credit_note_items; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.credit_note_items (id, credit_note_id, product_id, quantity, unit_price, subtotal) FROM stdin;
\.


--
-- Data for Name: credit_notes; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.credit_notes (id, sale_id, client_id, status, date, total, return_to_stock, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.expense_categories (id, name, is_active, created_by, created_at, updated_at) FROM stdin;
1	Servicios	t	\N	2026-01-20 12:57:38.15-03	2026-01-20 12:57:38.15-03
2	Alquiler	t	\N	2026-01-20 12:57:38.15-03	2026-01-20 12:57:38.15-03
3	Impuestos	t	\N	2026-01-20 12:57:38.15-03	2026-01-20 12:57:38.15-03
4	Insumos	t	\N	2026-01-20 12:57:38.15-03	2026-01-20 12:57:38.15-03
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.permissions (id, key, module, description) FROM stdin;
24	audit.read	security	Ver historial de auditoría
1	users.read	security	Ver usuarios
2	users.write	security	Gestionar usuarios
3	roles.read	security	Ver roles
4	roles.write	security	Gestionar roles
5	products.read	products	Ver productos
6	products.write	products	Gestionar productos
13	clients.read	clients	Ver clientes
14	clients.write	clients	Gestionar clientes
7	sales.read	sales	Ver ventas
15	sales.write	sales	Gestionar ventas
8	sales.confirm	sales	Confirmar venta
9	cash.open	cash	Abrir caja
10	cash.close	cash	Cerrar caja
11	cash.read	cash	Ver caja
12	cash.movements.write	cash	Cargar movimientos de caja
16	suppliers.read	purchases	Ver proveedores
17	suppliers.write	purchases	Gestionar proveedores
18	purchases.read	purchases	Ver compras
19	purchases.write	purchases	Gestionar órdenes de compra
20	purchases.receive	purchases	Confirmar recepción
21	credit_notes.read	credit_notes	Ver notas de crédito
22	credit_notes.write	credit_notes	Gestionar notas de crédito
23	credit_notes.confirm	credit_notes	Confirmar notas de crédito
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.product_categories (id, name, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.products (id, sku, barcode, name, description, category_id, unit, location, is_active, stock_min, stock_current, tax_rate, cost, price_retail, price_wholesale, price_promo, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_cost, tax_rate, subtotal) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.purchase_orders (id, supplier_id, status, order_date, expected_date, notes, total, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_receipt_items; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.purchase_receipt_items (id, purchase_receipt_id, product_id, quantity_received, unit_cost, subtotal) FROM stdin;
\.


--
-- Data for Name: purchase_receipts; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.purchase_receipts (id, purchase_order_id, receipt_date, status, notes, received_by) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at) FROM stdin;
1	1	28ae990a2df47cbc57517aac35f239e87917fb2802aa9e90b73d9a88e540cb22	2026-01-27 13:58:48.372-03	\N	2026-01-20 13:58:48.372-03
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.role_permissions (id, role_id, permission_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	1	21
22	1	22
23	1	23
24	2	7
25	2	15
26	2	8
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.roles (id, name, description) FROM stdin;
1	ADMIN	Administrador
2	VENTAS	Ventas
3	CAJA	Caja
4	STOCK	Stock
\.


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.sale_items (id, sale_id, product_id, quantity, unit_price, unit_cost_snapshot, discount, tax_rate, subtotal) FROM stdin;
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.sales (id, client_id, status, sale_date, payment_type, subtotal, discount_total, tax_total, total, notes, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.stock_movements (id, product_id, type, quantity, unit_cost, unit_price, reference_type, reference_id, notes, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: supplier_account_movements; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.supplier_account_movements (id, supplier_id, type, amount, reference_type, reference_id, notes, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.suppliers (id, name, document, contact_name, phone, email, address, is_active, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.user_roles (id, user_id, role_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: gestion_ventas; Owner: postgres
--

COPY gestion_ventas.users (id, username, password_hash, full_name, email, is_active, last_login_at, created_by, created_at, updated_at) FROM stdin;
1	admin	$2a$10$B.HoLAwJGmkd9C.utkoR2uR7ISqjWbOIt6kPl/1UON56xrfag5AMK	Administrador	\N	t	2026-01-20 13:58:48.352-03	\N	2026-01-20 12:57:38.139-03	2026-01-20 13:58:48.354-03
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.audit_logs_id_seq', 1, false);


--
-- Name: cash_movements_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.cash_movements_id_seq', 1, false);


--
-- Name: cash_registers_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.cash_registers_id_seq', 1, false);


--
-- Name: client_account_movements_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.client_account_movements_id_seq', 1, false);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.clients_id_seq', 1, false);


--
-- Name: credit_note_items_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.credit_note_items_id_seq', 1, false);


--
-- Name: credit_notes_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.credit_notes_id_seq', 1, false);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.expense_categories_id_seq', 4, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.permissions_id_seq', 1, false);


--
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.product_categories_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.products_id_seq', 1, false);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.purchase_order_items_id_seq', 1, false);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.purchase_orders_id_seq', 1, false);


--
-- Name: purchase_receipt_items_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.purchase_receipt_items_id_seq', 1, false);


--
-- Name: purchase_receipts_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.purchase_receipts_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.refresh_tokens_id_seq', 1, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.role_permissions_id_seq', 26, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.roles_id_seq', 1, false);


--
-- Name: sale_items_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.sale_items_id_seq', 1, false);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.sales_id_seq', 1, false);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.stock_movements_id_seq', 1, false);


--
-- Name: supplier_account_movements_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.supplier_account_movements_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.suppliers_id_seq', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.user_roles_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: gestion_ventas; Owner: postgres
--

SELECT pg_catalog.setval('gestion_ventas.users_id_seq', 1, false);


--
-- Name: SequelizeData SequelizeData_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas."SequelizeData"
    ADD CONSTRAINT "SequelizeData_pkey" PRIMARY KEY (name);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cash_movements cash_movements_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_movements
    ADD CONSTRAINT cash_movements_pkey PRIMARY KEY (id);


--
-- Name: cash_registers cash_registers_date_user_id_unique; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_registers
    ADD CONSTRAINT cash_registers_date_user_id_unique UNIQUE (date, user_id);


--
-- Name: cash_registers cash_registers_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_registers
    ADD CONSTRAINT cash_registers_pkey PRIMARY KEY (id);


--
-- Name: client_account_movements client_account_movements_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.client_account_movements
    ADD CONSTRAINT client_account_movements_pkey PRIMARY KEY (id);


--
-- Name: clients clients_document_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.clients
    ADD CONSTRAINT clients_document_key UNIQUE (document);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: credit_note_items credit_note_items_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_note_items
    ADD CONSTRAINT credit_note_items_pkey PRIMARY KEY (id);


--
-- Name: credit_notes credit_notes_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_notes
    ADD CONSTRAINT credit_notes_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_name_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.expense_categories
    ADD CONSTRAINT expense_categories_name_key UNIQUE (name);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_key_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.permissions
    ADD CONSTRAINT permissions_key_key UNIQUE (key);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_name_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.product_categories
    ADD CONSTRAINT product_categories_name_key UNIQUE (name);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_receipt_items purchase_receipt_items_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipt_items
    ADD CONSTRAINT purchase_receipt_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_receipts purchase_receipts_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipts
    ADD CONSTRAINT purchase_receipts_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_unique; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_unique UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: supplier_account_movements supplier_account_movements_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.supplier_account_movements
    ADD CONSTRAINT supplier_account_movements_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_document_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.suppliers
    ADD CONSTRAINT suppliers_document_key UNIQUE (document);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_unique; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_unique UNIQUE (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: audit_logs_action; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX audit_logs_action ON gestion_ventas.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX audit_logs_created_at ON gestion_ventas.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_type_entity_id; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX audit_logs_entity_type_entity_id ON gestion_ventas.audit_logs USING btree (entity_type, entity_id);


--
-- Name: audit_logs_user_id; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX audit_logs_user_id ON gestion_ventas.audit_logs USING btree (user_id);


--
-- Name: cash_movements_cash_register_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX cash_movements_cash_register_id_idx ON gestion_ventas.cash_movements USING btree (cash_register_id);


--
-- Name: client_account_movements_client_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX client_account_movements_client_id_idx ON gestion_ventas.client_account_movements USING btree (client_id);


--
-- Name: credit_note_items_credit_note_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX credit_note_items_credit_note_id_idx ON gestion_ventas.credit_note_items USING btree (credit_note_id);


--
-- Name: products_category_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX products_category_id_idx ON gestion_ventas.products USING btree (category_id);


--
-- Name: purchase_order_items_po_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX purchase_order_items_po_id_idx ON gestion_ventas.purchase_order_items USING btree (purchase_order_id);


--
-- Name: purchase_receipt_items_pr_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX purchase_receipt_items_pr_id_idx ON gestion_ventas.purchase_receipt_items USING btree (purchase_receipt_id);


--
-- Name: refresh_tokens_token_hash_unique; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_hash_unique ON gestion_ventas.refresh_tokens USING btree (token_hash);


--
-- Name: sale_items_sale_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX sale_items_sale_id_idx ON gestion_ventas.sale_items USING btree (sale_id);


--
-- Name: stock_movements_product_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX stock_movements_product_id_idx ON gestion_ventas.stock_movements USING btree (product_id);


--
-- Name: supplier_account_movements_supplier_id_idx; Type: INDEX; Schema: gestion_ventas; Owner: postgres
--

CREATE INDEX supplier_account_movements_supplier_id_idx ON gestion_ventas.supplier_account_movements USING btree (supplier_id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cash_movements cash_movements_cash_register_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_movements
    ADD CONSTRAINT cash_movements_cash_register_id_fkey FOREIGN KEY (cash_register_id) REFERENCES gestion_ventas.cash_registers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cash_movements cash_movements_expense_category_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_movements
    ADD CONSTRAINT cash_movements_expense_category_id_fkey FOREIGN KEY (expense_category_id) REFERENCES gestion_ventas.expense_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cash_movements cash_movements_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_movements
    ADD CONSTRAINT cash_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cash_registers cash_registers_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.cash_registers
    ADD CONSTRAINT cash_registers_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: client_account_movements client_account_movements_client_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.client_account_movements
    ADD CONSTRAINT client_account_movements_client_id_fkey FOREIGN KEY (client_id) REFERENCES gestion_ventas.clients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: client_account_movements client_account_movements_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.client_account_movements
    ADD CONSTRAINT client_account_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: clients clients_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.clients
    ADD CONSTRAINT clients_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: credit_note_items credit_note_items_credit_note_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_note_items
    ADD CONSTRAINT credit_note_items_credit_note_id_fkey FOREIGN KEY (credit_note_id) REFERENCES gestion_ventas.credit_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_note_items credit_note_items_product_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_note_items
    ADD CONSTRAINT credit_note_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES gestion_ventas.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credit_notes credit_notes_client_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_notes
    ADD CONSTRAINT credit_notes_client_id_fkey FOREIGN KEY (client_id) REFERENCES gestion_ventas.clients(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: credit_notes credit_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_notes
    ADD CONSTRAINT credit_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credit_notes credit_notes_sale_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.credit_notes
    ADD CONSTRAINT credit_notes_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES gestion_ventas.sales(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: expense_categories expense_categories_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.expense_categories
    ADD CONSTRAINT expense_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_categories product_categories_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.product_categories
    ADD CONSTRAINT product_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES gestion_ventas.product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES gestion_ventas.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES gestion_ventas.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES gestion_ventas.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_receipt_items purchase_receipt_items_product_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipt_items
    ADD CONSTRAINT purchase_receipt_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES gestion_ventas.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_receipt_items purchase_receipt_items_purchase_receipt_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipt_items
    ADD CONSTRAINT purchase_receipt_items_purchase_receipt_id_fkey FOREIGN KEY (purchase_receipt_id) REFERENCES gestion_ventas.purchase_receipts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_receipts purchase_receipts_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipts
    ADD CONSTRAINT purchase_receipts_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES gestion_ventas.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_receipts purchase_receipts_received_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.purchase_receipts
    ADD CONSTRAINT purchase_receipts_received_by_fkey FOREIGN KEY (received_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES gestion_ventas.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES gestion_ventas.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sale_items sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sale_items
    ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES gestion_ventas.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES gestion_ventas.sales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales sales_client_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sales
    ADD CONSTRAINT sales_client_id_fkey FOREIGN KEY (client_id) REFERENCES gestion_ventas.clients(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales sales_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.sales
    ADD CONSTRAINT sales_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES gestion_ventas.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stock_movements stock_movements_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.stock_movements
    ADD CONSTRAINT stock_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_account_movements supplier_account_movements_supplier_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.supplier_account_movements
    ADD CONSTRAINT supplier_account_movements_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES gestion_ventas.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: supplier_account_movements supplier_account_movements_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.supplier_account_movements
    ADD CONSTRAINT supplier_account_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: suppliers suppliers_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.suppliers
    ADD CONSTRAINT suppliers_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES gestion_ventas.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: gestion_ventas; Owner: postgres
--

ALTER TABLE ONLY gestion_ventas.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES gestion_ventas.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict mD3ggVrH0RES9rasFgdZ354yUPxr5jaKoycFUesqo3ZhGaDFxzN8c6hAU7cuMe1

