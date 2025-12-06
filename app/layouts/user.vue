 <script>
import Navbar from "~/components/Navbar.vue";
import Sidebar from "~/components/Sidebar.vue";
import FooterPage from "~/components/FooterPage.vue";
</script>
 <template>
    <div>
     <Navbar />
    <Sidebar />
    <slot />
    <FooterPage />
  </div>
 </template>