import type { ComponentType, SVGProps } from "react";
import {
  SparkleIcon,
  ToothIcon,
  ShieldPlusIcon,
  WrenchIcon,
  SmileIcon,
  SunIcon,
  HeartIcon,
  ChatIcon,
} from "./icons";

export const serviceIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  default: ToothIcon,
  konsultasi: ChatIcon,
  scaling: SparkleIcon,
  "tambal-gigi": ToothIcon,
  "perawatan-saluran-akar": ShieldPlusIcon,
  "cabut-gigi": WrenchIcon,
  odontektomi: SmileIcon,
  bleaching: SunIcon,
  "gigi-anak": HeartIcon,
};
