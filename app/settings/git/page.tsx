import { SettingsSidebar } from "@/components/settings-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Display",
    href: "/settings/display",
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
  },
  {
    title: "Git",
    href: "/settings/git",
  },
]

export default function SettingsGitPage() {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <SettingsSidebar items={sidebarNavItems} />
      <div className="flex-1 lg:max-w-2xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Git Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Git repository to enable continuous deployment.
            </p>
          </div>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>Connect Repository</CardTitle>
              <CardDescription>Link your GitHub, GitLab, or Bitbucket repository.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input id="repo-url" placeholder="https://github.com/your-org/your-repo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Default Branch</Label>
                <Input id="branch" placeholder="main" defaultValue="main" />
              </div>
              <Button>Connect Repository</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
