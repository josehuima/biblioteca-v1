import { Home, Users, BookOpen, ClipboardList, UserPlus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const items = [
  {
    img: Home,
    route: "/admin",
    text: "Painel administrativo",
  },
  {
    img: Users,
    route: "/admin/allusers",
    text: "Usuários",
  },
  {
    img: BookOpen,
    route: "/admin/allbooks",
    text: "Todos os livros",
  },
  {
    img: ClipboardList,
    route: "/admin/book-requests",
    text: "Requisições de livros",
  },
  {
    img: UserPlus,
    route: "/admin/account-requests",
    text: "Requisições de conta",
  },
];

const SideBar = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-600">Biblioteca Digital</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.text}>
                    <SidebarMenuButton className="text-green-600" asChild>
                      <a href={item.route}>
                        <item.img />
                        <span>{item.text}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
export default SideBar