
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { BookOpen, BookText, BookCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Componente para os itens de menu com dropdown
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const MenuNavigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/") && "bg-accent text-accent-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem
                title="Todos os Cursos"
                href="/cursos"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Explore todos os nossos cursos disponíveis.</span>
                </div>
              </ListItem>
              <ListItem
                title="Tecnologia"
                href="/cursos/tecnologia"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1">
                  <BookText className="h-4 w-4" />
                  <span>Cursos na área de tecnologia e programação.</span>
                </div>
              </ListItem>
              <ListItem
                title="Negócios"
                href="/cursos/negocios"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1">
                  <BookCheck className="h-4 w-4" />
                  <span>Cursos na área de negócios e empreendedorismo.</span>
                </div>
              </ListItem>
              <ListItem
                title="Educação"
                href="/cursos/educacao"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1">
                  <BookCheck className="h-4 w-4" />
                  <span>Cursos na área de educação e pedagogia.</span>
                </div>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/quem-somos">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/quem-somos") && "bg-accent text-accent-foreground"
              )}
            >
              Quem Somos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/contato">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/contato") && "bg-accent text-accent-foreground"
              )}
            >
              Contato
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuNavigation;
