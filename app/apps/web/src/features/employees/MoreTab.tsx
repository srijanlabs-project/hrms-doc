import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMyConsent, setMyConsent } from "../../lib/api/consent";
import { listMyPips } from "../../lib/api/performance";
import { addCertification, addEducation, addPriorExperience, addSkill, getBackground } from "../../lib/api/people-extras";
import { CONSENT_PURPOSES } from "../../lib/api/types";
import { useAuth } from "../auth/AuthProvider";

const SKILL_TYPES = ["Skill", "Language"];
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

/** Consolidates education & experience, certifications, and skills/languages. */
export function MoreTab({ employeeId }: { employeeId: string }) {
  const { user } = useAuth();
  const isSelf = user?.employeeId === employeeId;
  const queryClient = useQueryClient();
  const background = useQuery({ queryKey: ["background", employeeId], queryFn: () => getBackground(employeeId) });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["background", employeeId] });

  const consent = useQuery({ queryKey: ["consent-mine"], queryFn: listMyConsent, enabled: isSelf });
  const myPips = useQuery({ queryKey: ["pips", "mine"], queryFn: listMyPips, enabled: isSelf });
  const consentMutation = useMutation({
    mutationFn: ({ purpose, status }: { purpose: string; status: "Granted" | "Revoked" }) => setMyConsent(purpose, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consent-mine"] }),
  });

  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [certName, setCertName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const [skillType, setSkillType] = useState("Skill");
  const [skillName, setSkillName] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("Intermediate");

  const educationMutation = useMutation({
    mutationFn: () =>
      addEducation(employeeId, {
        degree,
        institution,
        startYear: startYear ? Number(startYear) : undefined,
        endYear: endYear ? Number(endYear) : undefined,
      }),
    onSuccess: () => {
      invalidate();
      setDegree("");
      setInstitution("");
      setStartYear("");
      setEndYear("");
    },
  });

  const experienceMutation = useMutation({
    mutationFn: () =>
      addPriorExperience(employeeId, {
        companyName,
        title,
        startDate,
        endDate: endDate || undefined,
      }),
    onSuccess: () => {
      invalidate();
      setCompanyName("");
      setTitle("");
      setStartDate("");
      setEndDate("");
    },
  });

  const certMutation = useMutation({
    mutationFn: () => addCertification(employeeId, { name: certName, issuingOrganization, issueDate: issueDate || undefined }),
    onSuccess: () => {
      invalidate();
      setCertName("");
      setIssuingOrganization("");
      setIssueDate("");
    },
  });

  const skillMutation = useMutation({
    mutationFn: () => addSkill(employeeId, { skillType, name: skillName, proficiencyLevel }),
    onSuccess: () => {
      invalidate();
      setSkillName("");
    },
  });

  return (
    <div className="space-y-4">
      <Card title="Education">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            educationMutation.mutate();
          }}
        >
          <input required placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="input" />
          <input required placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} className="input flex-1 basis-40" />
          <input placeholder="Start Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="input w-28" />
          <input placeholder="End Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="input w-28" />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
        </form>
        <ul className="space-y-1">
          {background.data?.education.map((e) => (
            <li key={e.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-medium">{e.degree}</span> · {e.institution} {e.startYear && `(${e.startYear}–${e.endYear ?? "present"})`}
            </li>
          ))}
          {background.data?.education.length === 0 && <p className="text-xs text-ink-faint">No education records.</p>}
        </ul>
      </Card>

      <Card title="Prior Experience">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            experienceMutation.mutate();
          }}
        >
          <input required placeholder="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input" />
          <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
        </form>
        <ul className="space-y-1">
          {background.data?.priorExperience.map((p) => (
            <li key={p.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-medium">{p.title}</span> at {p.companyName}
            </li>
          ))}
          {background.data?.priorExperience.length === 0 && <p className="text-xs text-ink-faint">No prior experience recorded.</p>}
        </ul>
      </Card>

      <Card title="Certifications">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            certMutation.mutate();
          }}
        >
          <input required placeholder="Certification Name" value={certName} onChange={(e) => setCertName(e.target.value)} className="input flex-1 basis-40" />
          <input required placeholder="Issuing Organization" value={issuingOrganization} onChange={(e) => setIssuingOrganization(e.target.value)} className="input flex-1 basis-40" />
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
        </form>
        <ul className="space-y-1">
          {background.data?.certifications.map((c) => (
            <li key={c.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-medium">{c.name}</span> · {c.issuingOrganization}
            </li>
          ))}
          {background.data?.certifications.length === 0 && <p className="text-xs text-ink-faint">No certifications recorded.</p>}
        </ul>
      </Card>

      <Card title="Skills & Languages">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            skillMutation.mutate();
          }}
        >
          <select value={skillType} onChange={(e) => setSkillType(e.target.value)} className="input w-28">
            {SKILL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input required placeholder="Name" value={skillName} onChange={(e) => setSkillName(e.target.value)} className="input" />
          <select value={proficiencyLevel} onChange={(e) => setProficiencyLevel(e.target.value)} className="input w-36">
            {PROFICIENCY_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {background.data?.skills.map((s) => (
            <li key={s.id}>
              <Badge tone={s.skillType === "Language" ? "info" : "neutral"}>
                {s.name} · {s.proficiencyLevel}
              </Badge>
            </li>
          ))}
          {background.data?.skills.length === 0 && <p className="text-xs text-ink-faint">No skills or languages recorded.</p>}
        </ul>
      </Card>

      {isSelf && (
        <Card title="Privacy & Consent">
          <p className="mb-3 text-xs text-ink-faint">Control what you've agreed to share or be contacted about.</p>
          <ul className="space-y-1">
            {CONSENT_PURPOSES.map((purpose) => {
              const record = consent.data?.find((r) => r.purpose === purpose);
              const status = record?.status ?? "Not Set";
              return (
                <li key={purpose} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                  <span>{purpose}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone={status === "Granted" ? "positive" : status === "Revoked" ? "negative" : "neutral"}>{status}</Badge>
                    {status !== "Granted" && (
                      <button
                        type="button"
                        onClick={() => consentMutation.mutate({ purpose, status: "Granted" })}
                        className="text-xs text-primary hover:underline"
                      >
                        Grant
                      </button>
                    )}
                    {status !== "Revoked" && status !== "Not Set" && (
                      <button
                        type="button"
                        onClick={() => consentMutation.mutate({ purpose, status: "Revoked" })}
                        className="text-xs text-negative hover:underline"
                      >
                        Revoke
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {isSelf && (
        <Card title="Performance Improvement Plans">
          <ul className="space-y-2">
            {myPips.data?.map((pip) => (
              <li key={pip.id} className="rounded-lg border border-border p-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {new Date(pip.startDate).toLocaleDateString("en-IN")} – {new Date(pip.endDate).toLocaleDateString("en-IN")}
                  </span>
                  <Badge tone={pip.status === "Completed" ? "positive" : pip.status === "Failed" ? "negative" : pip.status === "Extended" ? "warning" : "info"}>
                    {pip.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-faint">{pip.reason}</p>
                <ul className="mt-2 space-y-0.5">
                  {pip.objectives.map((o) => (
                    <li key={o.id} className="text-xs">
                      <Badge tone={o.status === "Completed" ? "positive" : "neutral"}>{o.status === "Completed" ? "Done" : "Pending"}</Badge>{" "}
                      {o.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {myPips.data?.length === 0 && <p className="text-xs text-ink-faint">No performance improvement plans on record.</p>}
          </ul>
        </Card>
      )}
    </div>
  );
}
