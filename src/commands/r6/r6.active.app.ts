import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
var mysql = require('mysql');
var tabname = 'cdklist'
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class R6Active extends AppCommand {
    code = 'active'; // 只是用作标记
    trigger = 'active'; // 用于触发的文字
    help = '.r6 active+KEY（注意：请私聊机器人此指令！！！）'; // 帮助文字
    intro = '激活测试权限';
    response: 'both' = 'both';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        var flag = 0;
        bot.API.guild.userList('3128617072930683')//r6小队频道id
            .then(function (response) {
                var flag: boolean = true;
                for (var i = 0; i < response.items.length; i++) {
                    if (response.items[i].id == session.userId) {
                        for (var j = 0; j < response.items[i].roles.length; j++) {
                            if (response.items[i].roles[j] == 373758) {//内测用户组
                                flag = false
                                break;
                            }
                        }
                        break;
                    }
                }
                var permission = async function () {
                    if (flag == true)
                        await recordkey(await searchkey(session.args[0]))
                    else
                        session.send("已经激活了内测用户组")

                }()

            })
            .catch(error => { console.log(error) })
        async function searchkey(cdk: string) {
            return new Promise<string>((resolve, reject) => {
                var exp = 'SELECT act FROM ' + tabname + ' WHERE cdk="' + cdk + '" && act=0';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        session.send("参数错误")
                    }
                    else if (JSON.stringify(result).search('"act":0') !== -1) {
                        //var r6id = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                        resolve(cdk);
                    }
                    else {
                        session.send("CDK错误或已经被激活！")
                    }
                });
            })
        }
        async function recordkey(cdk: string) {
            return new Promise<void>((resolve, reject) => {
                var today = new Date();
                var exp = 'UPDATE ' + tabname + ' SET act=1, actdate="' + today.toISOString().substring(0, 10) + '", id=' + session.userId + ' WHERE cdk="' + cdk + "\"";
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        session.send("参数错误")
                    }
                    else {
                        
                        var active = async function () {
                            await session.user.grantRole(373758, '3128617072930683');//内测
                            await session.user.grantRole(373739, session.guildId);//赞助者
                            await session.send('激活成功，感谢支持');
                            resolve()
                        }()

                    }
                })
            })
        }
    }
}
export const r6Active = new R6Active();
