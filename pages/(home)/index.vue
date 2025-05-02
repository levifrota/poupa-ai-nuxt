<template>
  <div>
    <!--<Navbar />
    
    <ScrollArea class="m-0 mt-0 flex flex-col sm:m-0 sm:overflow-hidden sm:p-6">
      <div class="m-3 flex flex-col justify-between sm:flex-row">
        <h1 class="self-center py-2 text-2xl font-bold sm:self-auto md:py-0">
          Painel
        </h1>

        <div class="flex flex-row items-center justify-between gap-3 sm:justify-normal">
          <AiReportButton
            :month="month"
            :has-premium-plan="user?.publicMetadata?.subscriptionPlan === 'premium'"
          />
          
          <TimeSelect />
        </div>
      </div>
      
      <div class="grid grid-cols-[2fr,-1fr] gap-6 sm:overflow-hidden lg:grid-cols-[2fr,1fr]">
        <div class="flex flex-col gap-6 sm:overflow-hidden">
          <SummaryCards
            :month="month"
            :deposits-total="dashboard.depositsTotal"
            :investments-total="dashboard.investmentsTotal"
            :expenses-total="dashboard.expensesTotal"
            :balance="dashboard.balance"
            :types-percentage="dashboard.typesPercentage"
            :user-can-add-transaction="userCanAddTransaction"
          />

          <div class="grid grid-cols-1 gap-y-6 sm:h-auto sm:grid-rows-1 sm:gap-y-6 md:grid-cols-3 md:gap-6">
            <TransactionsPieChart :types-percentage="dashboard.typesPercentage" />
            
            <ExpensesPerCategory
              :expenses-per-category="dashboard.totalExpensePerCategory"
            />
          </div>
        </div>

        <LastTransactions :last-transactions="dashboard.lastTransactions" />
      </div>
    </ScrollArea>
    
    <ScreenWrapper />-->

    <!-- <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="loadDashboard"
    >
      Carregar Dashboard
    </button> -->
    <!-- <button @click="loadDate">
      Teste firebase
    </button> -->
    <div v-if="dateValue">
      <p>{{ dateValue }}</p>
    </div>

    <div v-if="loading">Carregando...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <pre v-if="dashboard" class="bg-gray-100 p-4 rounded overflow-auto text-sm text-black">
      {{ dashboard }}
    </pre>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "#imports";
// import { doc, setDoc } from "firebase/firestore";
// import { getDashboard } from "~/data/get-dashboard";

const month = 3;
const loading = ref(false);
const dashboard = ref<unknown>(null);
const error = ref("");
const dateValue = ref('')

// const loadDate = async () => {
//   loading.value = true;
//   error.value = "";
//   try {
//     const today = new Date();
//     const formattedDate = today.toISOString().split('T')[0];

//     const docRef = doc(db, "transactions", formattedDate);

//     await setDoc(docRef, {
//       date: formattedDate,
//     });

//     dateValue.value = formattedDate;
//   } catch (err: unknown) {
//     error.value = "Erro ao enviar data para o Firestore";
//     console.error(err);
//   } finally {
//     loading.value = false;
//   }
// };

// const loadDashboard = async () => {
//   loading.value = true;
//   error.value = "";
//   try {
//     const result = await getDashboard(month.toString());
//     dashboard.value = result;
//   } catch (err: unknown) {
//     error.value = "Erro ao buscar dashboard";
//     console.error(err);
//   } finally {
//     loading.value = false;
//   }
// };
// import { useUser } from '@clerk/vue'
// import { ScrollArea } from '#components';
// import { getDashboard } from "~/data/get-dashboard/index";

// const route = useRoute();
// const { user } = useUser();

// const month = ref(route.query.month || new Date().getMonth() + 1);
// const dashboard = ref(null);
// const userCanAddTransaction = ref(false);

// onMounted(async () => {
//   if (!user.value) {
//     return navigateTo('/login');
//   }

//   if (typeof window !== 'undefined') {
//     localStorage.setItem('userId', user.value.id);
//   }

//   dashboard.value = await getDashboard(month.value);
//   userCanAddTransaction.value = await canUserAddTransaction();
// });

// watch(() => route.query.month, async (newMonth) => {
//   if (newMonth) {
//     month.value = newMonth;
//     dashboard.value = await getDashboard(month.value);
//   }
// });
</script>

