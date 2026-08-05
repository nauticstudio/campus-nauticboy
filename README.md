# 🎧 Nautic Campus

> **Plataforma privada de alto rendimiento para alumnos de producción musical.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Drive API](https://img.shields.io/badge/Google_Drive-API_v3-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://developers.google.com/drive)

Sistema de gestión académica y hub de contenidos pesados (plantillas DAW, librerías, stems, masterclasses y proyectos) diseñado para operar a **costo cero perpetuo** con almacenamiento optimizado en la nube.

---

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura de Almacenamiento](#-arquitectura-de-almacenamiento)
- [Configuración Local](#-configuración-local)
- [Configuración de Google Drive API](#-configuración-de-google-drive-api)
- [Endpoints de Almacenamiento](#-endpoints-de-almacenamiento)
- [Guardrails de Costo](#-guardrails-de-costo)
- [Nota de Arquitectura](#-nota-de-arquitectura)

---

## 📖 Visión General

**Nautic Campus** es una plataforma web moderna e interactiva orientada a la enseñanza de producción musical. Combina la velocidad de renderizado de **Next.js 16 (App Router)** y **React 19**, la seguridad relacional de **Supabase (PostgreSQL + Auth)**, y la capacidad de distribución masiva de archivos pesados utilizando **Google Drive API** mediante sesiones resumibles *Direct-to-Drive*.

---

## ✨ Características Principales

- 🔐 **Control de Acceso (RBAC):** Autenticación de usuarios y validación de estado de alumno mediante políticas RLS en Supabase PostgreSQL.
- ⚡ **Direct-to-Drive Uploads:** Carga resumible de archivos pesados directa desde el navegador del usuario a Google Drive, evitando intermediación y cuellos de botella en el servidor web.
- 🛡️ **Descargas Verificadas:** Flujo de descarga protegido en dos pasos que autentica sesión, rol activo y permisos sobre el recurso antes de otorgar el acceso.
- 🎨 **UI Modern & Scalable:** Interfaz elegante y reactiva construida con Tailwind CSS v4 y componentes shadcn/ui.
- 💰 **Costo Cero Garantizado:** Arquitectura diseñada para encajar estrictamente en los niveles gratuitos de Vercel Hobby, Supabase Free y Google Cloud Tier.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions y API Routes optimizados. |
| **UI Core** | React 19 + TypeScript | Desarrollo estructurado con tipado estricto end-to-end. |
| **Estilos** | Tailwind CSS v4 + shadcn/ui | Sistema de diseño rápido, limpio, accesible y 100% responsivo. |
| **Base de Datos & Auth** | Supabase (PostgreSQL) | Autenticación, gestión de sesiones y base de datos con políticas de seguridad RLS. |
| **Almacenamiento** | Google Drive API (v3) | Gestión y streaming de archivos pesados con alcance `drive.file`. |

---

## 🏗️ Arquitectura de Almacenamiento
