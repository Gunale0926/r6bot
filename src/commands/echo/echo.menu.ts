import { Card, MenuCommand } from 'kbotify';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand {
    code = 'echo';
    trigger = 'echo';
    help = '如需测试KMarkDown请发送".echo kmd"';
    intro = '查询菜单';
    menu = new Card().addText('echo kmd').toString();
    useCardMenu = true; // 使用卡片菜单
    
}

export const echoMenu = new EchoMenu(echoKmd);
