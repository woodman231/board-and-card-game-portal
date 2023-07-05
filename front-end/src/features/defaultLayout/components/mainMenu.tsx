import { Link } from "react-router-dom";
import Greeting from '../../common/components/greeting';
import { Popover } from '@headlessui/react';
import Bars3Icon from "@heroicons/react/20/solid/Bars3Icon"

function MainMenu() {
    return (
        <Popover>
            <Popover.Button>
                <Bars3Icon className="h-8" />
            </Popover.Button>
            <Popover.Panel className="absolute bg-stone-800 border border-white p-2">
                <Greeting />
                <hr />
                <div>
                    <Link to='/'>Home Page</Link>
                </div>
                <div>
                    <Link to='/chatroom'>Chat Room</Link>
                </div>
            </Popover.Panel>
        </Popover>
    );
}

export default MainMenu;
