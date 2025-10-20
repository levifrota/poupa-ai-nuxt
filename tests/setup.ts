// tests/setup.ts
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { ref, computed, watch, onMounted } from 'vue'

// Exportar funções Vue para uso global
global.ref = ref
global.computed = computed
global.watch = watch
global.onMounted = onMounted

// Mock Nuxt components
config.global.stubs = {
  NuxtLink: true,
  Icon: true,
  Card: true,
  CardHeader: true,
  CardTitle: true,
  CardContent: true,
  CardDescription: true,
  CardFooter: true,
  Button: true,
  ScrollArea: true,
  Dialog: true,
  DialogContent: true,
  DialogHeader: true,
  DialogTitle: true,
  DialogDescription: true,
  DialogTrigger: true,
  DialogClose: true,
  DialogFooter: true,
  Select: true,
  SelectTrigger: true,
  SelectValue: true,
  SelectContent: true,
  SelectItem: true,
  Input: true,
  FormField: true,
  FormItem: true,
  FormLabel: true,
  FormControl: true,
  FormMessage: true,
  MoneyInput: true,
  DatePicker: true,
}

// Mock console
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock Nuxt auto-imports
vi.mock('#app', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    path: '/',
    query: {},
  })),
  navigateTo: vi.fn(),
  useCookie: vi.fn((name: string) => {
    const cookieValues: Record<string, any> = {
      theme: ref('dark'),
      fontFamily: ref('default'),
      fontSize: ref('medium')
    }
    return cookieValues[name] || ref(null)
  }),
}))

// Mock vuefire
vi.mock('vuefire', () => ({
  useCurrentUser: vi.fn(() => ref({ uid: 'test-user-id' })),
}))

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
    fromDate: vi.fn((date) => ({ toDate: () => date })),
  },
}))

vi.mock('~/lib/firebase', () => ({
  db: vi.fn(() => ({})),
}))