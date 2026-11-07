"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import {
  User,
  Shield,
  Film,
  List,
  Bell,
  Upload,
  Link2,
  Code2,
  Camera,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  Globe,
  Lock,
  Users as UsersIcon,
  UserCheck,
} from "lucide-react"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "anime", label: "Anime & Manga", icon: Film },
  { id: "lists", label: "Lists", icon: List },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "import", label: "Import Lists", icon: Upload },
  { id: "apps", label: "Apps Linked", icon: Link2 },
  { id: "developer", label: "Developer", icon: Code2 },
] as const

type SectionId = (typeof sections)[number]["id"]

// ─── Profile Section ────────────────────────────────────────────────
const privacyOptions = [
  { value: "public", label: "Publico", desc: "Cualquiera puede ver tu perfil", icon: Globe },
  { value: "followers", label: "Solo seguidores", desc: "Solo quienes te siguen", icon: UserCheck },
  { value: "mutual", label: "Seguidores mutuos", desc: "Solo si ambos se siguen", icon: UsersIcon },
  { value: "private", label: "Privado", desc: "Solo tu puedes ver tu perfil", icon: Lock },
] as const

function ProfileSection() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [location, setLocation] = useState(user?.location || "")
  const [profilePrivacy, setProfilePrivacy] = useState("public")
  const [saved, setSaved] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  function handleSave() {
    updateUser({ name, bio, location })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleFileUpload(field: "banner" | "avatar") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 2 * 1024 * 1024) return // Max 2MB
      const reader = new FileReader()
      reader.onload = () => {
        updateUser({ [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground">Personaliza tu perfil publico.</p>
      </div>

      {/* Banner */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Banner</label>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload("banner")} />
        <div
          className="relative h-32 bg-secondary/50 border border-dashed border-border rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => bannerInputRef.current?.click()}
        >
          {user?.banner ? (
            <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Camera className="h-6 w-6" />
            </div>
          )}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-sm font-medium text-foreground">Cambiar banner</span>
          </div>
        </div>
        {user?.banner && (
          <button
            type="button"
            onClick={() => updateUser({ banner: null })}
            className="mt-2 flex items-center gap-1.5 text-xs text-destructive hover:underline"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar banner
          </button>
        )}
      </div>

      {/* Avatar */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Avatar</label>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload("avatar")} />
        <div className="flex items-center gap-4">
          <div
            className="relative h-20 w-20 rounded-xl bg-secondary/50 border border-dashed border-border overflow-hidden group cursor-pointer shrink-0"
            onClick={() => avatarInputRef.current?.click()}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <User className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="h-5 w-5 text-foreground" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>JPG, PNG o GIF. Max 2MB.</p>
            <p className="text-xs mt-1">Recomendado: 256x256px</p>
            {user?.avatar && (
              <button
                type="button"
                onClick={() => updateUser({ avatar: null })}
                className="mt-1 flex items-center gap-1.5 text-xs text-destructive hover:underline"
              >
                <Trash2 className="h-3 w-3" />
                Eliminar avatar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="settings-name" className="text-sm font-medium text-foreground mb-1.5 block">
          Nombre
        </label>
        <input
          id="settings-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="settings-bio" className="text-sm font-medium text-foreground mb-1.5 block">
          Bio
        </label>
        <textarea
          id="settings-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          placeholder="Cuentanos algo sobre ti..."
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="settings-location" className="text-sm font-medium text-foreground mb-1.5 block">
          Ubicacion
        </label>
        <input
          id="settings-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          placeholder="Ciudad, Pais"
        />
      </div>

      {/* Profile Privacy */}
      <div className="border-t border-border pt-6">
        <label className="text-sm font-medium text-foreground mb-1 block">Privacidad del perfil</label>
        <p className="text-xs text-muted-foreground mb-3">Controla quien puede ver tu perfil y actividad.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
          {privacyOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setProfilePrivacy(opt.value)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                  profilePrivacy === opt.value
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/30 border-border hover:border-border/80"
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${profilePrivacy === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-medium ${profilePrivacy === opt.value ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="self-start px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
      >
        {saved ? "Guardado" : "Guardar cambios"}
      </button>
    </div>
  )
}

// ─── Account Section ────────────────────────────────────────────────
const RESERVED_USERNAMES = ["admin", "yumedb", "test", "moderator", "support", "help", "root", "system"]

function AccountSection() {
  const { user, updateUser } = useAuth()
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [username, setUsername] = useState(user?.username || "")
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle")
  const [usernameSaved, setUsernameSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkUsername = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    
    if (!value.trim() || value === user?.username) {
      setUsernameStatus("idle")
      return
    }

    // Validate format: lowercase, alphanumeric, underscores, 3-20 chars
    const validFormat = /^[a-z0-9_]{3,20}$/.test(value)
    if (!validFormat) {
      setUsernameStatus("invalid")
      return
    }

    setUsernameStatus("checking")
    debounceRef.current = setTimeout(() => {
      const isTaken = RESERVED_USERNAMES.includes(value.toLowerCase())
      setUsernameStatus(isTaken ? "taken" : "available")
    }, 500)
  }, [user?.username])

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
    setUsername(value)
    setUsernameSaved(false)
    checkUsername(value)
  }

  function handleUsernameSave() {
    if (usernameStatus !== "available" && username !== user?.username) return
    updateUser({ username })
    setUsernameSaved(true)
    setUsernameStatus("idle")
    setTimeout(() => setUsernameSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Account</h2>
        <p className="text-sm text-muted-foreground">Gestiona tu cuenta y seguridad.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
        <input
          type="email"
          defaultValue={user?.email || ""}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
        <div className="flex flex-col gap-2 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              maxLength={20}
              className={`w-full pl-7 pr-10 py-2.5 bg-secondary/50 border rounded-lg text-sm text-foreground outline-none focus:ring-2 transition-all ${
                usernameStatus === "available" ? "border-emerald-500 focus:ring-emerald-500/50 focus:border-emerald-500" :
                usernameStatus === "taken" || usernameStatus === "invalid" ? "border-destructive focus:ring-destructive/50 focus:border-destructive" :
                "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              )}
              {usernameStatus === "available" && (
                <Check className="h-4 w-4 text-emerald-500" />
              )}
              {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
          {usernameStatus === "taken" && (
            <p className="text-xs text-destructive">Este nombre de usuario ya esta en uso.</p>
          )}
          {usernameStatus === "invalid" && (
            <p className="text-xs text-destructive">3-20 caracteres. Solo letras minusculas, numeros y guiones bajos.</p>
          )}
          {usernameStatus === "available" && (
            <p className="text-xs text-emerald-500">Nombre de usuario disponible.</p>
          )}
          {(usernameStatus === "available" || (username !== user?.username && usernameStatus === "idle")) && (
            <button
              type="button"
              onClick={handleUsernameSave}
              disabled={usernameStatus !== "available"}
              className="self-start px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {usernameSaved ? "Guardado" : "Guardar username"}
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Cambiar contrasena</h3>
        <div className="flex flex-col gap-3 max-w-md">
          <input
            type={showPw ? "text" : "password"}
            placeholder="Contrasena actual"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Nueva contrasena"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Confirmar nueva contrasena"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="self-start px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Actualizar contrasena
            </button>
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="p-2.5 text-muted-foreground hover:text-foreground bg-secondary/50 rounded-lg border border-border transition-colors"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border-t border-destructive/20 pt-6 mt-2">
        <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-destructive">Zona peligrosa</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Eliminar tu cuenta es permanente y no se puede deshacer.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 border border-destructive/30 transition-colors"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Anime & Manga Section ─────────────────────────────────────────
function AnimeSection() {
  const [scoreFormat, setScoreFormat] = useState("10-point")
  const [titleLang, setTitleLang] = useState("romaji")
  const [nsfw, setNsfw] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState("watching")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Anime & Manga</h2>
        <p className="text-sm text-muted-foreground">Configura tus preferencias de anime y manga.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Estado por defecto al agregar</label>
        <select
          value={defaultStatus}
          onChange={(e) => setDefaultStatus(e.target.value)}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="watching">Viendo</option>
          <option value="plan_to_watch">Planeado</option>
          <option value="completed">Completado</option>
          <option value="on_hold">En pausa</option>
          <option value="dropped">Abandonado</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Formato de puntuacion</label>
        <div className="flex flex-wrap gap-2 max-w-md">
          {[
            { value: "10-point", label: "10 puntos" },
            { value: "10-decimal", label: "10 decimal" },
            { value: "5-star", label: "5 estrellas" },
            { value: "3-smiley", label: "3 emociones" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setScoreFormat(opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                scoreFormat === opt.value
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Idioma de titulos</label>
        <div className="flex flex-wrap gap-2 max-w-md">
          {[
            { value: "romaji", label: "Romaji" },
            { value: "english", label: "English" },
            { value: "native", label: "Nativo (JP)" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTitleLang(opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                titleLang === opt.value
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between max-w-md p-4 bg-secondary/30 rounded-xl border border-border">
        <div>
          <p className="text-sm font-medium text-foreground">Contenido NSFW</p>
          <p className="text-xs text-muted-foreground mt-0.5">Mostrar contenido para adultos en resultados</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={nsfw}
          onClick={() => setNsfw(!nsfw)}
          className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${nsfw ? "bg-primary" : "bg-secondary border border-border"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${nsfw ? "translate-x-5" : ""}`} />
        </button>
      </div>
    </div>
  )
}

// ─── Lists Section ──────────────────────────────────────────────────
const LIST_COLORS = [
  "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
]
const LIST_ICONS = [
  { value: "star", label: "Estrella" },
  { value: "heart", label: "Corazon" },
  { value: "trophy", label: "Trofeo" },
  { value: "repeat", label: "Re-ver" },
  { value: "bookmark", label: "Marcador" },
  { value: "flame", label: "Fuego" },
  { value: "gift", label: "Regalo" },
  { value: "sparkles", label: "Brillos" },
]

function ListsSection() {
  const { user, addCustomList, updateCustomList, removeCustomList } = useAuth()
  const [privacy, setPrivacy] = useState("public")
  const [defaultSort, setDefaultSort] = useState("title")
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formColor, setFormColor] = useState(LIST_COLORS[0])
  const [formIcon, setFormIcon] = useState("star")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const lists = user?.customLists || []

  function resetForm() {
    setFormName("")
    setFormDesc("")
    setFormColor(LIST_COLORS[0])
    setFormIcon("star")
    setCreating(false)
    setEditing(null)
  }

  function handleCreate() {
    if (!formName.trim()) return
    addCustomList({ name: formName.trim(), description: formDesc.trim(), color: formColor, icon: formIcon })
    resetForm()
  }

  function startEdit(list: typeof lists[0]) {
    setEditing(list.id)
    setFormName(list.name)
    setFormDesc(list.description)
    setFormColor(list.color)
    setFormIcon(list.icon)
    setCreating(false)
  }

  function handleUpdate() {
    if (!editing || !formName.trim()) return
    updateCustomList(editing, { name: formName.trim(), description: formDesc.trim(), color: formColor, icon: formIcon })
    resetForm()
  }

  function handleDelete(id: string) {
    removeCustomList(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Lists</h2>
        <p className="text-sm text-muted-foreground">Configura como funcionan tus listas y crea listas personalizadas.</p>
      </div>

      {/* Privacy */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Privacidad de listas</label>
        <p className="text-xs text-muted-foreground mb-3">Controla quien puede ver tus listas de anime y manga.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
          {privacyOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrivacy(opt.value)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                  privacy === opt.value
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/30 border-border hover:border-border/80"
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${privacy === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-medium ${privacy === opt.value ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Default sort */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Orden por defecto</label>
        <select
          value={defaultSort}
          onChange={(e) => setDefaultSort(e.target.value)}
          className="w-full max-w-md px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="title">Titulo</option>
          <option value="score">Puntuacion</option>
          <option value="last_updated">Ultimo actualizado</option>
          <option value="last_added">Ultimo agregado</option>
        </select>
      </div>

      {/* Custom Lists Manager */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-foreground block">Listas personalizadas</label>
            <p className="text-xs text-muted-foreground mt-0.5">Crea listas custom para organizar tu anime y manga.</p>
          </div>
          {!creating && !editing && (
            <button
              type="button"
              onClick={() => { resetForm(); setCreating(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva lista
            </button>
          )}
        </div>

        {/* Create / Edit form */}
        {(creating || editing) && (
          <div className="mb-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              {creating ? "Crear nueva lista" : "Editar lista"}
            </h4>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre de la lista"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <textarea
                placeholder="Descripcion (opcional)"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />

              {/* Color picker */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Color</label>
                <div className="flex gap-2">
                  {LIST_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`h-7 w-7 rounded-lg border-2 transition-all ${formColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Icono</label>
                <div className="flex flex-wrap gap-1.5">
                  {LIST_ICONS.map((ic) => (
                    <button
                      key={ic.value}
                      type="button"
                      onClick={() => setFormIcon(ic.value)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                        formIcon === ic.value
                          ? "bg-primary/10 text-primary border-primary/30 font-medium"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={creating ? handleCreate : handleUpdate}
                  disabled={!formName.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {creating ? "Crear lista" : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing lists */}
        <div className="flex flex-col gap-2">
          {/* Default lists (read only) */}
          {[
            { name: "Viendo", color: "#3b82f6" },
            { name: "Completado", color: "#10b981" },
            { name: "En pausa", color: "#f59e0b" },
            { name: "Abandonado", color: "#ef4444" },
            { name: "Planeado", color: "#6b7280" },
          ].map((dl) => (
            <div key={dl.name} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl border border-border/50">
              <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: dl.color }} />
              <span className="text-sm font-medium text-foreground flex-1">{dl.name}</span>
              <span className="text-[10px] text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded-md">Por defecto</span>
            </div>
          ))}

          {/* Custom lists */}
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border group"
            >
              <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: list.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{list.name}</p>
                {list.description && (
                  <p className="text-xs text-muted-foreground truncate">{list.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEdit(list)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                  title="Editar"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                {deleteConfirm === list.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(list.id)}
                      className="px-2 py-1 text-[10px] font-medium bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-[10px] font-medium bg-secondary text-muted-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(list.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {lists.length === 0 && !creating && (
            <div className="p-6 text-center bg-secondary/20 rounded-xl border border-dashed border-border">
              <List className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tienes listas personalizadas</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Crea una para organizar tu anime y manga a tu manera.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Section ──────────────────────────────────────────
function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    episodes: true,
    recommendations: true,
    social: true,
    system: false,
    email: false,
  })

  function toggle(key: keyof typeof notifs) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    { key: "episodes" as const, label: "Nuevos episodios", desc: "Cuando sale un nuevo episodio de un anime en tu lista" },
    { key: "recommendations" as const, label: "Recomendaciones", desc: "Sugerencias basadas en tus gustos" },
    { key: "social" as const, label: "Social / Seguidores", desc: "Nuevos seguidores, likes y comentarios" },
    { key: "system" as const, label: "Actualizaciones del sistema", desc: "Noticias y cambios en la plataforma" },
    { key: "email" as const, label: "Notificaciones por email", desc: "Recibir resumen semanal por correo" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Notifications</h2>
        <p className="text-sm text-muted-foreground">Elige que notificaciones quieres recibir.</p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifs[item.key]}
              onClick={() => toggle(item.key)}
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${
                notifs[item.key] ? "bg-primary" : "bg-secondary border border-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
                  notifs[item.key] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Import Lists Section ───────────────────────────────────────────
function ImportSection() {
  const sources = [
    { name: "MyAnimeList", desc: "Importar desde tu perfil MAL", color: "bg-[#2E51A2]/10 text-[#2E51A2] border-[#2E51A2]/30" },
    { name: "AniList", desc: "Importar desde tu perfil AniList", color: "bg-[#02A9FF]/10 text-[#02A9FF] border-[#02A9FF]/30" },
    { name: "Kitsu", desc: "Importar desde tu perfil Kitsu", color: "bg-[#F75239]/10 text-[#F75239] border-[#F75239]/30" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Import Lists</h2>
        <p className="text-sm text-muted-foreground">Importa tus listas desde otras plataformas.</p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg">
        {sources.map((src) => (
          <div key={src.name} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">{src.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{src.desc}</p>
            </div>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${src.color} hover:opacity-80`}
            >
              Importar
            </button>
          </div>
        ))}
      </div>

      {/* File upload area */}
      <div className="max-w-lg">
        <p className="text-sm font-medium text-foreground mb-2">O sube un archivo XML/JSON</p>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Arrastra un archivo aqui o haz click para seleccionar</p>
          <p className="text-xs text-muted-foreground/60 mt-1">XML o JSON exportado desde MAL, AniList o Kitsu</p>
        </div>
      </div>
    </div>
  )
}

// ─── Apps Linked Section ────────────────────────────────────────────
function AppsSection() {
  const [apps, setApps] = useState([
    { name: "MyAnimeList", connected: true, username: "@demouser" },
    { name: "Discord", connected: false, username: "" },
    { name: "AniList", connected: false, username: "" },
    { name: "Twitter / X", connected: false, username: "" },
  ])

  function toggleApp(name: string) {
    setApps((prev) =>
      prev.map((a) =>
        a.name === name
          ? { ...a, connected: !a.connected, username: !a.connected ? "@demouser" : "" }
          : a
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Apps Linked</h2>
        <p className="text-sm text-muted-foreground">Conecta tus cuentas de otras plataformas.</p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg">
        {apps.map((app) => (
          <div key={app.name} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">{app.name}</p>
              {app.connected ? (
                <p className="text-xs text-primary mt-0.5">Conectado como {app.username}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">No conectado</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleApp(app.name)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                app.connected
                  ? "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                  : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
              }`}
            >
              {app.connected ? "Desconectar" : "Conectar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Developer Section ──────────────────────────────────────────────
function DeveloperSection() {
  const [keys, setKeys] = useState([
    { id: 1, name: "Production Key", key: "ydb_live_sk_a1b2c3d4e5f6g7h8i9j0", created: "15 Ene 2026", lastUsed: "Hoy" },
  ])
  const [showKey, setShowKey] = useState<number | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  function createKey() {
    const id = keys.length + 1
    const random = Math.random().toString(36).substring(2, 22)
    setKeys([
      ...keys,
      {
        id,
        name: `Key ${id}`,
        key: `ydb_live_sk_${random}`,
        created: "Ahora",
        lastUsed: "Nunca",
      },
    ])
  }

  function revokeKey(id: number) {
    setKeys(keys.filter((k) => k.id !== id))
  }

  function copyKey(id: number, key: string) {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Developer</h2>
        <p className="text-sm text-muted-foreground">Gestiona tus API keys y acceso programatico.</p>
      </div>

      {/* Usage stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        {[
          { label: "Peticiones hoy", value: "1,247" },
          { label: "Limite diario", value: "10,000" },
          { label: "Uso", value: "12.5%" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-secondary/30 rounded-xl border border-border text-center">
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* API Keys */}
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
          <button
            type="button"
            onClick={createKey}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Crear key
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {keys.length === 0 ? (
            <div className="p-6 text-center bg-secondary/30 rounded-xl border border-border">
              <Code2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tienes API keys</p>
            </div>
          ) : (
            keys.map((k) => (
              <div key={k.id} className="p-4 bg-secondary/30 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{k.name}</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                    >
                      {showKey === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyKey(k.id, k.key)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                    >
                      {copied === k.id ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => revokeKey(k.id)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground bg-background/50 px-2 py-1.5 rounded-md border border-border/50">
                  {showKey === k.id ? k.key : k.key.replace(/(?<=.{12}).*/g, (m) => "*".repeat(m.length))}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground/60">
                  <span>Creada: {k.created}</span>
                  <span>Ultimo uso: {k.lastUsed}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Settings Page ─────────────────────────────────────────────
export default function SettingsPage() {
  const { isAuthenticated, hydrated } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SectionId>("profile")

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  function renderSection() {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "account":
        return <AccountSection />
      case "anime":
        return <AnimeSection />
      case "lists":
        return <ListsSection />
      case "notifications":
        return <NotificationsSection />
      case "import":
        return <ImportSection />
      case "apps":
        return <AppsSection />
      case "developer":
        return <DeveloperSection />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold font-display text-foreground mb-6">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Desktop */}
            <nav className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
              {sections.map((s) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                      activeSection === s.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {s.label}
                  </button>
                )
              })}
            </nav>

            {/* Sidebar - Mobile select */}
            <div className="lg:hidden">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as SectionId)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-6">
              {renderSection()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
