---
title: Teramot — Compliance & Security
weight: 1
---

{{< tabs items="🇺🇸 English,🇪🇸 Español" >}}

{{< tab >}}

<div style="text-align:center; margin: 1rem 0">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/img/compliance/LogoBlancoTeramotHorizontal.png">
    <img src="/img/compliance/LogoNegroTeramotHorizontal.png" alt="Teramot Logo" width="200">
  </picture>
</div>

---

### Executive Summary

- **SOC 2 Type I audit** – *Successfully completed* with a U.S. auditing firm. Teramot has obtained its first SOC 2 report, covering the Security criteria. December 2025.

<div style="text-align:center; margin: 1rem 0">
  <img src="/img/compliance/soc2-new.png" alt="SOC 2" height="90" style="object-fit:contain" />
</div>

- **SOC 2 Type II audit** – *Observation period in progress* as part of the path to our SOC 2 Type II report.
- **ISO 27001 documentation & evidence** – currently underway (*Vanta sync in progress*).
- **Compliance monitoring** – supported by **Vanta**, our continuous compliance facilitator.
- **Recent Pentest** – performed by **Faraday Sec (Argentina)**. **15 vulnerabilities** were identified and **fully remediated**.

### Security & Development Tools

<div style="text-align:center; margin: 24px 0">
  <div style="display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:20px; margin-bottom:16px">
    <img src="/img/compliance/faraday-logo-light.png" alt="Faraday Sec" height="70" style="border-radius:6px; padding:8px; background:#e5e7eb" />
    <img src="/img/compliance/soc2-logo.png" alt="SOC 2" height="90" style="object-fit:contain" />
    <img src="/img/compliance/vanta-logo.svg" alt="Vanta" height="70" style="object-fit:contain; border-radius:6px; padding:8px; background:#e5e7eb" />
    <img src="/img/compliance/bitdefender.png" alt="Bitdefender" height="70" style="object-fit:contain" />
  </div>
  <div style="display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:20px">
    <img src="/img/compliance/aws-waf.png" alt="AWS WAF" height="70" style="object-fit:contain" />
    <img src="/img/compliance/guardduty.png" alt="AWS GuardDuty" height="70" style="object-fit:contain" />
    <img src="/img/compliance/cloudwatch.png" alt="CloudWatch" height="70" style="object-fit:contain" />
    <img src="/img/compliance/terraform.png" alt="Terraform" height="70" style="object-fit:contain; border-radius:6px; padding:8px; background:#e5e7eb" />
    <img src="/img/compliance/bitwarden.png" alt="Bitwarden" height="70" style="object-fit:contain" />
    <img src="/img/compliance/dependabot.png" alt="Dependabot" height="70" style="object-fit:contain" />
  </div>
</div>

---

## 1 Company & Governance Snapshot

| Item | Detail |
| --- | --- |
| **Legal Name** | Halley LLC |
| **Headquarters** | Rosario, Argentina |
| **U.S. Entity** | Registered in Delaware |
| **HQ Address** | 16192 Coastal Highway, City of Lewes, Country of Sussex, DE 19958 |
| **Countries Served** | Argentina · United States |
| **Information Security Committee** | Bruno Ruyu · Lucas Uzal · Leandro Ruspini · Ezequiel Alejandro Mora · Valentín Torassa Colombero |
| **Policy Approval** | Approved by Valentín Torassa Colombero – Cybersecurity Analyst |

---

## 2 Compliance Posture Overview

| Framework / Report | Status | Auditor | Period | Next Review |
| --- | --- | --- | --- | --- |
| **SOC 2 Type I** | Completed | U.S. Audit Firm | Completed | Available under NDA |
| **SOC 2 Type II** | Observation period in progress | U.S. Audit Firm | In progress | After observation period |
| **ISO 27001** | Documentation in progress | — | Continuous | Target 2026 |
| **Local Privacy Laws** | Law 25.326 (Argentina), SOC 2 Privacy Criteria | — | Ongoing | Annual Review Q1 2026 |

---

## 3 ISMS Highlights

> For complete policy documentation, visit the [Policies](/compliance/policies/) section

| Domain | Key Control | Implementation |
| --- | --- | --- |
| **Identity & Access Management** | MFA enabled across AWS, GitHub & Vanta accounts | Active |
| **Cloud Security** | GuardDuty, CloudTrail, WAF, and CloudWatch alerts | Continuous |
| **Endpoint Protection** | Bitdefender GravityZone | Active |
| **Secrets & Passwords** | Bitwarden vaults with MFA & org-scoped policies | Enforced |
| **Encryption** | All data encrypted *at rest* and *in transit* | AES-256 / TLS 1.3 |
| **Vulnerability & Patch Mgmt** | Continuous monitoring + remediation validated via pentests | Active |
| **Compliance Monitoring** | Vanta agent with AWS integration | Continuous |
| **Secure Development** | CI/CD with tests, Dependabot, Terraform validation, and peer review | Active |

---

## 4 Secure Software Development Life-Cycle (SSDLC)

1. Feature branches with **Pull Requests**.
2. **Automated tests** and **CI/CD pipelines** (GitHub Actions) validate each change.
3. Progressive deployments to **dev**, **stg**, and **prd** on **AWS ECS**.
4. Infrastructure is defined and deployed with **Terraform**.
5. **Dependabot** manages security/dependency updates.
6. Access protected with **MFA** and **least-privilege IAM**.

---

## 5 Data Privacy & Residency

| Domain | Detail |
| --- | --- |
| **Hosting Region** | AWS (us-east-1) |
| **Processing Model** | 100% cloud; no on-premises processing |
| **Compliance** | Law 25.326 (Argentina) and SOC 2 Privacy Criteria |
| **Encryption** | AES-256 at rest, TLS 1.3 in transit |
| **Retention & Deletion** | According to contractual and regulatory requirements |

---

## 6 Incident Response & Monitoring

| Component | Description |
| --- | --- |
| **Detection Tools** | AWS GuardDuty, CloudWatch Alarms, Bitdefender, AWS WAF |
| **Response Team** | Managed internally by Cybersecurity and DevOps |
| **Notification** | Customers are informed promptly upon validation of any security event |
| **Root Cause Analysis** | Documented internally and shared under NDA upon request |

---

## 7 Third-Party Risk & Pentest Results

Independent Security Testing by **Faraday Sec (Argentina)**, validating **15 vulnerabilities** — all **resolved**. Reports and remediation tracking documented with continuous follow-up.

---

## 8 Revision History

| Date | Author | Role | Notes |
| --- | --- | --- | --- |
| Oct 2025 | Valentín Torassa Colombero | Cybersecurity & Compliance Analyst | Initial release |

---

### SOC 2 Report Access

If your organization needs access to Teramot's final SOC 2 report, you can request it by emailing **security@teramot.com** (subject to NDA).

<p align="center"><b>Teramot – Halley LLC • Rosario / Miami • October 2025 — Version 1.0</b></p>

{{< /tab >}}

{{< tab >}}

<div style="text-align:center; margin: 1rem 0">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/img/compliance/LogoBlancoTeramotHorizontal.png">
    <img src="/img/compliance/LogoNegroTeramotHorizontal.png" alt="Teramot Logo" width="200">
  </picture>
</div>

---

### Resumen ejecutivo

- **SOC 2 Tipo I** – *Ya aprobado* con una firma auditora de EE. UU. Diciembre 2025.
- **SOC 2 Tipo II** – Actualmente en el *período de observación*.
- **ISO 27001** – Documentación y evidencias en curso (*Vanta sync in progress*).
- **Monitoreo de cumplimiento** – impulsado por **Vanta**.
- **Pentest reciente** – realizado por **Faraday Sec (Argentina)**. **15 vulnerabilidades** identificadas y **remediadas**.

---

## 1 Compañía & Gobernanza

| Ítem | Detalle |
| --- | --- |
| **Razón social** | Halley LLC |
| **Sede principal** | Rosario, Argentina |
| **Entidad en EE. UU.** | Registrada en Delaware |
| **Dirección HQ** | 16192 Coastal Highway, City of Lewes, DE 19958 |
| **Países atendidos** | Argentina · United States |
| **Comité de Seguridad** | Bruno Ruyu · Lucas Uzal · Leandro Ruspini · Ezequiel Alejandro Mora · Valentín Torassa Colombero |
| **Aprobación de políticas** | Valentín Torassa Colombero – Analista de Ciberseguridad |

---

## 2 Panorama de Cumplimiento

| Marco / Reporte | Estado | Auditor | Período | Próxima revisión |
| --- | --- | --- | --- | --- |
| **SOC 2 Tipo I** | Completado | Firma auditora EE. UU. | Completado | Bajo NDA a solicitud |
| **SOC 2 Tipo II** | Período de observación en curso | Firma auditora EE. UU. | En curso | Tras finalizar observación |
| **ISO 27001** | Documentación en curso | — | Continuo | Objetivo 2026 |
| **Privacidad local** | Ley 25.326 (AR), Criterios SOC 2 | — | Continuo | Q1 2026 |

---

## 3 SGSI — Destacados

| Dominio | Control clave | Implementación |
| --- | --- | --- |
| **Identidades & accesos** | MFA en AWS, GitHub y Vanta | Activo |
| **Seguridad en la nube** | GuardDuty, CloudTrail, WAF, CloudWatch | Continuo |
| **Protección de endpoints** | Bitdefender GravityZone | Activo |
| **Secretos & contraseñas** | Bitwarden con MFA y políticas organizacionales | Aplicado |
| **Encriptación** | Datos *en reposo* y *en tránsito* | AES-256 / TLS 1.3 |
| **Compliance** | Agente Vanta e integración AWS | Continuo |
| **Desarrollo seguro** | CI/CD, Dependabot, Terraform, peer review | Activo |

---

## 4 SSDLC

1. Ramas de **feature** y **Pull Requests**.
2. **Pruebas automatizadas** y **CI/CD** (GitHub Actions) validan cada cambio.
3. Despliegue progresivo a **dev**, **stg** y **prd** sobre **AWS ECS**.
4. Infraestructura con **Terraform**.
5. **Dependabot** para actualizaciones de seguridad.
6. Accesos con **MFA** y **roles IAM de mínimo privilegio**.

---

## 5 Privacidad y Residencia de Datos

| Dominio | Detalle |
| --- | --- |
| **Región de hosting** | AWS (us-east-1) |
| **Modelo** | 100 % cloud; sin on-premises |
| **Cumplimiento** | Ley 25.326 y SOC 2 Privacy Criteria |
| **Encriptación** | AES-256 en reposo, TLS 1.3 en tránsito |

---

### Acceso al informe SOC 2

Podés solicitarlo escribiendo a **security@teramot.com** (sujeto a NDA).

<p align="center"><b>Teramot – Halley LLC • Rosario / Miami • Octubre 2025 — Versión 1.0</b></p>

{{< /tab >}}

{{< /tabs >}}
