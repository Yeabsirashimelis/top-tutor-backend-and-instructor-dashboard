import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";

const CoursesImageDialog = ({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={imageUrl}
          alt={title}
          width={1000}
          height={1000}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="max-w-[60vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Image
            src={imageUrl}
            alt={title}
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoursesImageDialog;
