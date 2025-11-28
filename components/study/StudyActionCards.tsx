import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Upload, Link, Mic } from "lucide-react";

type ModalType = "upload" | "paste" | "record";

interface StudyActionCardsProps {
  setActiveModal: (modal: ModalType) => void;
}

const actions: {
  title: string;
  subtitle: string;
  icon: typeof Upload;
  modal: ModalType;
  color: string;
}[] = [
  {
    title: "Upload File",
    subtitle: "PDF, Image, Audio",
    icon: Upload,
    modal: "upload",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Paste Text",
    subtitle: "Notes, Articles, Links",
    icon: Link,
    modal: "paste",
    color: "text-purple-600 bg-purple-50",
  },
  {
    title: "Record Live",
    subtitle: "Lectures, Meetings",
    icon: Mic,
    modal: "record",
    color: "text-red-600 bg-red-50",
  },
];

export default function StudyActionCards({
  setActiveModal,
}: StudyActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
      {actions.map((action) => (
        <Card
          key={action.modal}
          className="hover:shadow-md transition-all cursor-pointer h-48 flex flex-col justify-center"
          onClick={() => setActiveModal(action.modal)}
        >
          <CardContent className="flex flex-col items-center text-center p-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-medium mb-1">
              {action.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{action.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
