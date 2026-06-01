--
-- PostgreSQL database dump
--

\restrict pimWXYgdo8P2OTppgBBIi5sbsuU3ZbUqJUVef5fDqe606vQLai7Rdyscy6jRZJj

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    icone character varying(50),
    descricao text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: estado_posto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_posto (
    id integer NOT NULL,
    posto_id integer,
    estado character varying(20),
    observacao text,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_posto_estado_check CHECK (((estado)::text = ANY ((ARRAY['operacional'::character varying, 'encerrado'::character varying, 'manutencao'::character varying])::text[])))
);


ALTER TABLE public.estado_posto OWNER TO postgres;

--
-- Name: estado_posto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_posto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_posto_id_seq OWNER TO postgres;

--
-- Name: estado_posto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_posto_id_seq OWNED BY public.estado_posto.id;


--
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    posto_id integer,
    dia_semana character varying(20),
    hora_abertura time without time zone,
    hora_fecho time without time zone
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_id_seq OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- Name: marcacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marcacoes (
    id integer NOT NULL,
    utilizador_id integer,
    posto_id integer,
    data_marcacao date NOT NULL,
    hora_marcacao time without time zone NOT NULL,
    estado character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT marcacoes_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendente'::character varying, 'confirmada'::character varying, 'cancelada'::character varying])::text[])))
);


ALTER TABLE public.marcacoes OWNER TO postgres;

--
-- Name: marcacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marcacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marcacoes_id_seq OWNER TO postgres;

--
-- Name: marcacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marcacoes_id_seq OWNED BY public.marcacoes.id;


--
-- Name: municipios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    provincia_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.municipios OWNER TO postgres;

--
-- Name: municipios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.municipios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.municipios_id_seq OWNER TO postgres;

--
-- Name: municipios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.municipios_id_seq OWNED BY public.municipios.id;


--
-- Name: postos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postos (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    endereco text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    telefone character varying(20),
    email character varying(100),
    servico_id integer,
    municipio_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.postos OWNER TO postgres;

--
-- Name: postos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postos_id_seq OWNER TO postgres;

--
-- Name: postos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postos_id_seq OWNED BY public.postos.id;


--
-- Name: provincias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincias (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.provincias OWNER TO postgres;

--
-- Name: provincias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provincias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provincias_id_seq OWNER TO postgres;

--
-- Name: provincias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provincias_id_seq OWNED BY public.provincias.id;


--
-- Name: servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    categoria_id integer,
    permite_marcacao boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.servicos OWNER TO postgres;

--
-- Name: servicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicos_id_seq OWNER TO postgres;

--
-- Name: servicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_id_seq OWNED BY public.servicos.id;


--
-- Name: supervisor_posto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supervisor_posto (
    id integer NOT NULL,
    supervisor_id integer,
    posto_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.supervisor_posto OWNER TO postgres;

--
-- Name: supervisor_posto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supervisor_posto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervisor_posto_id_seq OWNER TO postgres;

--
-- Name: supervisor_posto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supervisor_posto_id_seq OWNED BY public.supervisor_posto.id;


--
-- Name: utilizadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizadores (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    tipo character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    telefone character varying(20),
    CONSTRAINT utilizadores_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['cidadao'::character varying, 'supervisor'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.utilizadores OWNER TO postgres;

--
-- Name: utilizadores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizadores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilizadores_id_seq OWNER TO postgres;

--
-- Name: utilizadores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizadores_id_seq OWNED BY public.utilizadores.id;


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: estado_posto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_posto ALTER COLUMN id SET DEFAULT nextval('public.estado_posto_id_seq'::regclass);


--
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- Name: marcacoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcacoes ALTER COLUMN id SET DEFAULT nextval('public.marcacoes_id_seq'::regclass);


--
-- Name: municipios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios ALTER COLUMN id SET DEFAULT nextval('public.municipios_id_seq'::regclass);


--
-- Name: postos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postos ALTER COLUMN id SET DEFAULT nextval('public.postos_id_seq'::regclass);


--
-- Name: provincias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias ALTER COLUMN id SET DEFAULT nextval('public.provincias_id_seq'::regclass);


--
-- Name: servicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos ALTER COLUMN id SET DEFAULT nextval('public.servicos_id_seq'::regclass);


--
-- Name: supervisor_posto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor_posto ALTER COLUMN id SET DEFAULT nextval('public.supervisor_posto_id_seq'::regclass);


--
-- Name: utilizadores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizadores ALTER COLUMN id SET DEFAULT nextval('public.utilizadores_id_seq'::regclass);


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nome, icone, descricao, created_at) FROM stdin;
2	Saúde	health	Serviços de saúde pública	2026-05-23 20:18:57.852929
3	Justiça	justice	Serviços jurídicos e judiciais	2026-05-23 20:19:21.041765
4	Educação	education	Serviços de educação pública	2026-05-23 20:19:33.476424
5	Finanças	finance	Serviços financeiros e tributários	2026-05-23 20:19:43.851686
\.


--
-- Data for Name: estado_posto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_posto (id, posto_id, estado, observacao, updated_at) FROM stdin;
\.


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (id, posto_id, dia_semana, hora_abertura, hora_fecho) FROM stdin;
\.


--
-- Data for Name: marcacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marcacoes (id, utilizador_id, posto_id, data_marcacao, hora_marcacao, estado, created_at) FROM stdin;
4	1	1	2026-06-01	09:00:00	cancelada	2026-05-31 23:25:14.063609
3	1	5	2026-06-01	09:00:00	cancelada	2026-05-31 23:22:35.753361
2	1	4	2026-06-01	09:00:00	cancelada	2026-05-31 23:22:10.801958
1	1	1	2026-06-01	09:00:00	cancelada	2026-05-24 16:01:07.829187
5	1	1	2027-01-01	12:00:00	cancelada	2026-05-31 23:41:34.725529
6	1	1	2027-01-01	12:00:00	cancelada	2026-05-31 23:49:58.307062
8	7	1	2027-01-01	13:00:00	pendente	2026-06-01 02:04:27.165048
7	7	1	2026-12-01	12:00:00	cancelada	2026-06-01 02:04:11.288628
\.


--
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.municipios (id, nome, provincia_id, created_at) FROM stdin;
2	Luanda	74	2026-05-23 19:48:16.974009
\.


--
-- Data for Name: postos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postos (id, nome, endereco, latitude, longitude, telefone, email, servico_id, municipio_id, created_at) FROM stdin;
1	Hospital Américo Boavida	Rua Comandante Gika, Luanda	-8.83680000	13.23430000	+244 222 321 234	haboavida@minsaude.gov.ao	2	2	2026-05-23 20:34:22.229854
2	Hospital Américo Boavida	Rua Comandante Gika, Luanda	\N	\N	+244 222 321 234	haboavida@minsaude.gov.ao	7	2	2026-05-31 23:16:27.414383
3	Hospital Américo Boavida	Rua Comandante Gika, Luanda	\N	\N	+244 222 321 234	haboavida@minsaude.gov.ao	8	2	2026-05-31 23:16:27.414383
4	Centro de Saúde Maianga	Bairro Maianga, Luanda	\N	\N	+244 222 445 567	maianga@minsaude.gov.ao	8	2	2026-05-31 23:16:27.414383
5	Hospital Josina Machel	Av. Ho Chi Min, Luanda	\N	\N	+244 222 330 127	hjosina@minsaude.gov.ao	9	2	2026-05-31 23:16:27.414383
6	Laboratório Nacional	Rua Amilcar Cabral, Luanda	\N	\N	+244 222 123 456	labnac@minsaude.gov.ao	13	2	2026-05-31 23:16:27.414383
\.


--
-- Data for Name: provincias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provincias (id, nome, created_at) FROM stdin;
64	Bengo	2026-05-23 18:00:49.53866
65	Benguela	2026-05-23 18:00:49.53866
67	Cabinda	2026-05-23 18:00:49.53866
68	Cuando	2026-05-23 18:00:49.53866
69	Cubango	2026-05-23 18:00:49.53866
70	Cunene	2026-05-23 18:00:49.53866
71	Huambo	2026-05-23 18:00:49.53866
74	Luanda	2026-05-23 18:00:49.53866
75	Lunda Norte	2026-05-23 18:00:49.53866
76	Lunda Sul	2026-05-23 18:00:49.53866
77	Malanje	2026-05-23 18:00:49.53866
78	Moxico	2026-05-23 18:00:49.53866
79	Moxico Leste	2026-05-23 18:00:49.53866
80	Namibe	2026-05-23 18:00:49.53866
82	Zaire	2026-05-23 18:00:49.53866
83	Cuanza Norte	2026-05-23 18:00:49.53866
84	Cuanza Sul	2026-05-23 18:00:49.53866
66	Bié	2026-05-23 18:00:49.53866
72	Huíla	2026-05-23 18:00:49.53866
73	Ícolo e Bengo	2026-05-23 18:00:49.53866
81	Uíge	2026-05-23 18:00:49.53866
\.


--
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos (id, nome, descricao, categoria_id, permite_marcacao, created_at) FROM stdin;
2	Marcação de Consulta	Agende consultas em unidades de saúde públicas	2	t	2026-05-24 22:36:18.248222
3	Procurar Hospitais e Clínicas	Encontre hospitais e clínicas perto de si	2	f	2026-05-24 22:36:18.248222
4	Consulta de Exames	Consulte os resultados dos seus exames médicos	2	f	2026-05-24 22:36:18.248222
5	Histórico Médico	Aceda ao seu histórico médico pessoal	2	f	2026-05-24 22:36:18.248222
6	Pedido de Ambulância	Solicite uma ambulância em caso de emergência	2	f	2026-05-24 22:36:18.248222
7	Emissão de Receita Médica	Obtenha receitas médicas digitais	2	t	2026-05-24 22:36:18.248222
8	Cadastro de Pacientes	Registe-se como paciente numa unidade de saúde	2	t	2026-05-24 22:36:18.248222
9	Doação de Sangue	Encontre centros de doação de sangue	2	t	2026-05-24 22:36:18.248222
10	Serviços de Farmácia	Localize farmácias e consulte disponibilidade	2	f	2026-05-24 22:36:18.248222
11	Informações de Medicamentos	Consulte informações sobre medicamentos	2	f	2026-05-24 22:36:18.248222
12	Atendimento de Emergência	Contacte serviços de emergência médica	2	f	2026-05-24 22:36:18.248222
13	Marcação de Exames Laboratoriais	Agende exames em laboratórios públicos	2	t	2026-05-24 22:36:18.248222
14	Marcação para BI/Passaporte	Agende atendimento para emissão de BI ou Passaporte	3	t	2026-05-24 22:36:18.248222
15	Consulta de Processos Judiciais	Consulte o estado dos seus processos judiciais	3	f	2026-05-24 22:36:18.248222
16	Emissão de Certidões	Solicite certidões de nascimento, casamento e outros	3	t	2026-05-24 22:36:18.248222
17	Denúncia Online	Efectue denúncias online de forma segura	3	f	2026-05-24 22:36:18.248222
18	Registo de Nascimento	Registe o nascimento de um filho	3	t	2026-05-24 22:36:18.248222
19	Registo de Casamento	Registe oficialmente o seu casamento	3	t	2026-05-24 22:36:18.248222
20	Registo de Empresa	Registe a sua empresa oficialmente	3	t	2026-05-24 22:36:18.248222
21	Consulta de Multas	Consulte e pague multas pendentes	3	f	2026-05-24 22:36:18.248222
22	Autenticação de Documentos	Autentique documentos oficiais	3	t	2026-05-24 22:36:18.248222
23	Agendamento no Tribunal	Agende atendimento em tribunais	3	t	2026-05-24 22:36:18.248222
24	Consulta de Leis e Regulamentos	Aceda à legislação angolana	3	f	2026-05-24 22:36:18.248222
25	Procurar Escolas	Encontre escolas públicas e privadas perto de si	4	f	2026-05-24 22:36:18.248222
26	Fazer Inscrições	Inscreva-se em instituições de ensino	4	t	2026-05-24 22:36:18.248222
27	Emissão de Certificados Escolares	Solicite certificados e diplomas escolares	4	t	2026-05-24 22:36:18.248222
28	Matrículas Online	Efectue matrículas escolares online	4	t	2026-05-24 22:36:18.248222
29	Pedido de Declaração Escolar	Solicite declarações escolares	4	t	2026-05-24 22:36:18.248222
30	Consulta de Calendário Escolar	Consulte o calendário escolar oficial	4	f	2026-05-24 22:36:18.248222
31	Transferência de Escola	Solicite transferência entre escolas	4	t	2026-05-24 22:36:18.248222
32	Consulta de Notas	Consulte as suas notas e resultados	4	f	2026-05-24 22:36:18.248222
33	Cursos Online	Aceda a cursos e formações online	4	f	2026-05-24 22:36:18.248222
34	Consulta de Vagas Escolares	Verifique vagas disponíveis nas escolas	4	f	2026-05-24 22:36:18.248222
35	Solicitação de Bolsas de Estudo	Candidate-se a bolsas de estudo	4	t	2026-05-24 22:36:18.248222
36	Pagamento de Impostos	Pague os seus impostos online	5	f	2026-05-24 22:36:18.248222
37	Consulta de Saldo Bancário	Consulte o saldo das suas contas bancárias	5	f	2026-05-24 22:36:18.248222
38	Câmbio de Moeda	Consulte taxas de câmbio e localize casas de câmbio	5	f	2026-05-24 22:36:18.248222
39	Pagamento de Água	Pague a sua factura de água	5	f	2026-05-24 22:36:18.248222
40	Pagamento de Energia	Pague a sua factura de energia	5	f	2026-05-24 22:36:18.248222
41	Pagamento de Internet	Pague a sua factura de internet	5	f	2026-05-24 22:36:18.248222
42	Seguros Automóveis	Consulte e pague seguros automóveis	5	f	2026-05-24 22:36:18.248222
43	Procurar Postos de Atendimento	Encontre postos de atendimento bancário	5	f	2026-05-24 22:36:18.248222
44	Procurar ATM	Localize caixas multibanco perto de si	5	f	2026-05-24 22:36:18.248222
\.


--
-- Data for Name: supervisor_posto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supervisor_posto (id, supervisor_id, posto_id, created_at) FROM stdin;
\.


--
-- Data for Name: utilizadores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilizadores (id, nome, email, senha, tipo, created_at, telefone) FROM stdin;
1	Agente M	agentem0119@gmail.com	$2b$10$g5XxDK6XX977v4JopQOhtOlTxeBotAMaICdWiiJKvXL8/YuvrqXKS	admin	2026-05-23 20:50:56.709906	927169023
7	Rossane Domingos 	rossanepascoal03@gmail.com	$2a$10$Qn3B.WsPSIlj/2in5EI4yOrZfk18ldu.OamDw3LBehOGArHmna/DW	cidadao	2026-06-01 01:35:21.292654	926693437
\.


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 5, true);


--
-- Name: estado_posto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_posto_id_seq', 1, false);


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_id_seq', 1, false);


--
-- Name: marcacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marcacoes_id_seq', 8, true);


--
-- Name: municipios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.municipios_id_seq', 2, true);


--
-- Name: postos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postos_id_seq', 6, true);


--
-- Name: provincias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provincias_id_seq', 84, true);


--
-- Name: servicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_id_seq', 44, true);


--
-- Name: supervisor_posto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supervisor_posto_id_seq', 1, false);


--
-- Name: utilizadores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizadores_id_seq', 7, true);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: estado_posto estado_posto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_posto
    ADD CONSTRAINT estado_posto_pkey PRIMARY KEY (id);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- Name: marcacoes marcacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcacoes
    ADD CONSTRAINT marcacoes_pkey PRIMARY KEY (id);


--
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);


--
-- Name: postos postos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postos
    ADD CONSTRAINT postos_pkey PRIMARY KEY (id);


--
-- Name: provincias provincias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT provincias_pkey PRIMARY KEY (id);


--
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id);


--
-- Name: supervisor_posto supervisor_posto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor_posto
    ADD CONSTRAINT supervisor_posto_pkey PRIMARY KEY (id);


--
-- Name: utilizadores utilizadores_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizadores
    ADD CONSTRAINT utilizadores_email_key UNIQUE (email);


--
-- Name: utilizadores utilizadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizadores
    ADD CONSTRAINT utilizadores_pkey PRIMARY KEY (id);


--
-- Name: estado_posto estado_posto_posto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_posto
    ADD CONSTRAINT estado_posto_posto_id_fkey FOREIGN KEY (posto_id) REFERENCES public.postos(id);


--
-- Name: horarios horarios_posto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_posto_id_fkey FOREIGN KEY (posto_id) REFERENCES public.postos(id);


--
-- Name: marcacoes marcacoes_posto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcacoes
    ADD CONSTRAINT marcacoes_posto_id_fkey FOREIGN KEY (posto_id) REFERENCES public.postos(id);


--
-- Name: marcacoes marcacoes_utilizador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcacoes
    ADD CONSTRAINT marcacoes_utilizador_id_fkey FOREIGN KEY (utilizador_id) REFERENCES public.utilizadores(id);


--
-- Name: municipios municipios_provincia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_provincia_id_fkey FOREIGN KEY (provincia_id) REFERENCES public.provincias(id);


--
-- Name: postos postos_municipio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postos
    ADD CONSTRAINT postos_municipio_id_fkey FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- Name: postos postos_servico_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postos
    ADD CONSTRAINT postos_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id);


--
-- Name: servicos servicos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- Name: supervisor_posto supervisor_posto_posto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor_posto
    ADD CONSTRAINT supervisor_posto_posto_id_fkey FOREIGN KEY (posto_id) REFERENCES public.postos(id);


--
-- Name: supervisor_posto supervisor_posto_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor_posto
    ADD CONSTRAINT supervisor_posto_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.utilizadores(id);


--
-- PostgreSQL database dump complete
--

\unrestrict pimWXYgdo8P2OTppgBBIi5sbsuU3ZbUqJUVef5fDqe606vQLai7Rdyscy6jRZJj

