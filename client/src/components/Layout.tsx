import { styled } from "@mui/material";
import SideDrawer from "./SideDrawer";

const Page = styled("div")({
    backgroundColor: "#f9f9f9",
    width: "100%",
});

type LayoutProps = {
    children: React.ReactNode;
};

function Layout({ children }: LayoutProps ) {
    return <>
        <SideDrawer />

        <Page>
            {children}
        </Page>
    </>;
}

export default Layout;
