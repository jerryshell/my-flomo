import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordForm from "@/components/settings/PasswordForm";
import PluginPanel from "@/components/settings/PluginPanel";
import ReviewForm from "@/components/settings/ReviewForm";

const SettingsCard = () => {
  return (
    <Card id="settings" className="scroll-mt-20">
      <CardHeader>
        <CardTitle className="text-base">设置</CardTitle>
        <CardDescription>账户、每日回顾与插件</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account">
          <TabsList className="grid h-10 w-full grid-cols-3 md:h-8">
            <TabsTrigger value="account">账户</TabsTrigger>
            <TabsTrigger value="review">回顾</TabsTrigger>
            <TabsTrigger value="plugin">插件</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-4">
            <PasswordForm />
          </TabsContent>
          <TabsContent value="review" className="pt-4">
            <ReviewForm />
          </TabsContent>
          <TabsContent value="plugin" className="pt-4">
            <PluginPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
