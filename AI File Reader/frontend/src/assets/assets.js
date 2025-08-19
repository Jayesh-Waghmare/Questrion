import image from "./image.png";
import gradientBackground from "./gradientBackground.png";
import user_group from "./user_group.png";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import profile_img_1 from "./profile_img_1.png";
import arrow_icon from "./arrow_icon.svg";
import { File } from 'lucide-react'

export const assets = {
    image,
    gradientBackground,
    user_group,
    star_icon,
    star_dull_icon,
    profile_img_1,
    arrow_icon,
};

export const AiToolsData = [
    {
        title: 'PDF Reader',
        description: 'Get your pdf read by AI to improve your revision.',
        Icon: File,
        bg: { from: '#12B7AC', to: '#08B6CE' },
        path: '/ai/pdf'
    }
]